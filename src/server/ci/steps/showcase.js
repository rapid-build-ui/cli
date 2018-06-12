/********************
 * CI SHOWCASE STEPS
 ********************/
const util     = require('util');
const path     = require('path');
const fse      = require('fs-extra');
const exec     = util.promisify(require('child_process').exec);
const log      = require('../../common/logging/log');
const pkgHelp  = require('../../common/helpers/pkg');
const showcase = require('../../common/helpers/showcase');
const { publish, promote } = require('heroku-release');

/* API
 ******/
const Steps = {
	async createDirForClonedComponents(config) { // :Promise<boolean>
		const { paths } = config;
		const _path   = paths.abs.components;
		const dirname = path.basename(_path);
		log.buildStepBegin(`creating directory for cloned components`);
		try {
			await fse.remove(_path);
			await fse.ensureDir(_path);
			log.buildStepSuccess(`CREATED DIRECTORY ${dirname}`, { matchCase: true });
			return true;
		} catch(e) {
			log.buildStepError(`creating directory for cloned components`, { after: e, exit: true });
			return e;
		}
	},

	cloneComponentRepos(config) { // :Promise{}
		const { paths } = config;
		log.buildStepBegin(`cloning continuous rb components`);
		const components = showcase.getComponents(paths.abs.src.client);
		const cloneCmd   = 'git clone --depth 1 --branch continuous';
		const opts       = { cwd: paths.abs.components };
		const promises   = [];
		for (const [i, component] of components.entries()) {
			console.log(`${i+1}. ${component.name}`.info);
			const cmd     = `${cloneCmd} ${component.githubUrl}`;
			const promise = exec(cmd, opts);
			promises.push(promise);
		}
		return Promise.all(promises).then(results => {
			log.buildStepSuccess(`cloned continuous rb components`);
			return results; // git clone sends output to results.stderr
		}).catch(e => {
			log.buildStepError(`cloning continuous rb components`, { after: e, exit: true });
			return e;
		});
	},

	setupComponents(config) { // :Promise{}
		const { paths } = config;
		log.buildStepBegin(`setting up continuous rb components`);
		const components = showcase.getComponents(paths.abs.src.client);
		const cmd        = 'rapid-build prod publish && npm run link'
		const promises   = [];
		for (const [i, component] of components.entries()) {
			console.log(`${i+1}. ${component.name}`.info);
			const opts    = { cwd: `${paths.abs.components}/${component.name}` };
			const promise = exec(cmd, opts);
			promises.push(promise);
		}
		return Promise.all(promises).then(results => {
			for (const result of results) console.log(result.stdout);
			log.buildStepSuccess(`setup continuous rb components`);
			return results;
		}).catch(e => {
			log.buildStepError(`setting up continuous rb components`, { after: e, exit: true });
			return e;
		});
	},

	setupShowcase(config) { // :Promise{}
		const { paths } = config;
		log.buildStepBegin(`setting up showcase`);
		const cmd  = 'npm run setup';
		const opts = { cwd: paths.abs.project };
		return exec(cmd, opts).then(results => {
			log.buildStepSuccess(`setup showcase`, { before: results.stdout, trim: { before: true }});
			return results;
		}).catch(e => {
			log.buildStepError(`setting up showcase`, { after: e, exit: true });
			return e;
		});
	},

	createHerokuPkgJson(config) { // :Promise{}
		const { paths, repo } = config;
		const pkg         = pkgHelp.getPkg(paths.abs.project);
		const distPkgPath = `${config.paths.rel.dist.root}/package.json`;
		const rbServerCmd = 'node server/rapid-build';
		log.buildStepBegin(`CREATING HEROKU ${distPkgPath}`, { matchCase: true });
		const herokuPkg = {
			name:    repo.name,
			version: pkg.version,
			license: pkg.license,
			engines: pkg.engines,
			scripts: {
				start: `${rbServerCmd}/start-server`,
				stop:  `${rbServerCmd}/stop-server`
			}
		};
		const opts = { spaces: 2 };
		return fse.outputJson(distPkgPath, herokuPkg, opts).then(() => {
			log.buildStepSuccess(`created heroku package.json`);
			return herokuPkg;
		}).catch(e => {
			log.buildStepError(`creating heroku`, { after: e, exit: true });
			return e;
		})
	},

	installClient(config) { // :Promise{}
		const { paths, repo } = config;
		log.buildStepBegin(`YARN INSTALL CLIENT ${repo.name}`, { matchCase: true });
		const cmd  = 'yarn install --ignore-engines';
		const opts = { cwd: paths.rel.src.client };
		return exec(cmd, opts).then(results => {
			log.buildStepSuccess(`installed client`, { before: results.stdout, trim: { before: true }});
			return results;
		}).catch(e => {
			log.buildStepError(`installing client`, { after: e, exit: true });
			return e;
		});
	},

	installServer(config) { // :Promise{}
		const { paths, repo } = config;
		log.buildStepBegin(`NPM INSTALL SERVER ${repo.name}`, { matchCase: true });
		const cmd  = 'npm install';
		const opts = { cwd: paths.rel.src.server };
		return exec(cmd, opts).then(results => {
			log.buildStepSuccess(`installed server`, { before: results.stdout, trim: { before: true }});
			return results;
		}).catch(e => {
			log.buildStepError(`installing server`, { after: e, exit: true });
			return e;
		});
	},

	publishHerokuApp(config, app) { // :Promise{}
		app = `rapid-build-ui-io-${app}`;
		const { paths, tokens } = config;
		log.buildStepBegin(`PUBLISHING HEROKU APP ${app}`, { matchCase: true });
		const opts = {
			auth: tokens.heroku
		};
		return publish(app, paths.rel.dist.root, opts).then(results => {
			log.buildStepSuccess('published heroku app');
			return results;
		}).catch(e => {
			log.buildStepError('publishing heroku app', { after: e, exit: true });
			return e;
		});
	},

	promoteHerokuStaging(config) { // :Promise{}
		const prefix   = 'rapid-build-ui-io';
		const pipeline = prefix;
		const staging  = `${prefix}-staging`;
		const prod     = `${prefix}-prod`;
		const { tokens } = config;
		log.buildStepBegin(`PROMOTING HEROKU APP ${staging}`, { matchCase: true });
		const opts = {
			auth: tokens.heroku
		};
		return promote(pipeline, staging, prod, opts).then(results => {
			log.buildStepSuccess('promoted staging to production');
			return results;
		}).catch(e => {
			log.buildStepError('promoting heroku app', { after: e, exit: true });
			return e;
		});
	}
};

/* Export It!
 *************/
module.exports = Steps;
