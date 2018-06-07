/******************
 * CI COMMON STEPS
 ******************/
const util          = require('util');
const cpy           = require('cpy');
const fse           = require('fs-extra');
const request       = require('request');
const mustache      = require('mustache');
const post          = util.promisify(request.post);
const exec          = util.promisify(require('child_process').exec);
const log           = require('../../common/logging/log');
const pkgHelp       = require('../../common/helpers/pkg');
const changelogHelp = require('../../common/helpers/changelog');

/* API
 ******/
const Steps = {
	buildDist(config) { // :Promise{}
		const { paths, repo } = config;
		log.buildStepBegin(`building ${repo.name}`);
		const cmd  = 'rapid-build prod publish';
		const opts = { cwd: paths.project };
		return exec(cmd, opts).then(results => {
			log.buildStepSuccess(`built ${repo.name}`, { before: results.stdout, trim: { before: true }});
			return results;
		}).catch(e => {
			log.buildStepError(`building ${repo.name}`, { after: e, exit: true });
			return e;
		});
	},

	copyRootFilesToDist(config, distLoc) { // :Promise<number> (total copied files)
		const { paths } = config;
		const distPath  = paths.rel.dist[distLoc];
		log.buildStepBegin(`copying root files to ${distPath}`);
		const src  = ['.npmignore', 'LICENSE', 'CHANGELOG.md', 'README.md'];
		const dest = distPath;
		const opts = { cwd: paths.project };
		return cpy(src, dest, opts).then(results => {
			const total = results.length;
			log.buildStepSuccess(`copied ${total} root files to ${distPath}`);
			return total;
		}).catch(e => {
			log.buildStepError(`copying root files to ${distPath}`, { after: e, exit: true });
			return e;
		});
	},

	async copyNpmConfigToDist(config, distLoc) { // :Promise<boolean>
		const { paths, tokens } = config;
		const distPath = paths.rel.dist[distLoc];
		const template = `${__dirname}/../../common/templates/npmrc.tpl`;
		log.buildStepBegin(`copying npm config to ${distPath}`);
		try {
			let contents = await fse.readFile(template, 'utf8'); // path relative to process.cwd()
				contents = mustache.render(contents, { NPM_TOKEN: tokens.npm });
				contents = await fse.writeFile(`${distPath}/.npmrc`, contents);
			log.buildStepSuccess(`copied npm config to ${distPath}`);
			return true;
		} catch(e) {
			log.buildStepError(`copying npm config to ${distPath}`, { after: e, exit: true });
			return e;
		}
	},

	publishNpmPkg(config, distLoc) { // :Promise{}
		const { paths, repo } = config;
		const publishPath = paths.rel.dist[distLoc];
		const pkg         = pkgHelp.getPkg(paths.abs.dist[distLoc]);
		const version     = pkgHelp.prefixVersion(pkg.version);
		log.buildStepBegin(`PUBLISHING NPM PACKAGE ${version}`, { matchCase: true });
		const cmd  = `npm publish --access public`;
		const opts = { cwd: publishPath };
		return exec(cmd, opts).then(results => {
			log.buildStepSuccess(`PUBLISHED ${pkg.name}`, { before: results.stdout, trim: { before: true }, matchCase: true});
			return results;
		}).catch(e => {
			const eMsg = `${e.cmd}\n${e.stderr}`;
			log.buildStepError(`PUBLISHING ${pkg.name}`, { after: eMsg, exit: true, matchCase: true });
			return e;
		});
	},

	async publishGithubRelease(config, distLoc) { // :Promise{}
		const { paths, repo, tokens } = config;
		const version        = pkgHelp.getVersion(paths.abs.dist[distLoc], true); // ex: v0.0.2
		const changelogEntry = await changelogHelp.getEntry(paths.project, version);
		const url            = `https://api.github.com/repos/${repo.slug}/releases`;
		log.buildStepBegin(`PUBLISHING GITHUB RELEASE ${version}`, { matchCase: true });
		const opts = {
			url,
			json: true,
			headers: {
				'authorization': `token ${tokens.github}`,
				'user-agent': 'http://developer.github.com/v3/#user-agent-required'
			},
			body: {
				target_commitish: 'master',
				tag_name:         version,
				name:             version,
				body:             changelogEntry,
				draft:            false,
				prerelease:       false
			}
		};
		return post(opts).then(results => {
			const body = results.body;
			const e    = body.errors;
			if (e) {
				log.buildStepError('publishing github release', { after: e, exit: true });
				return e;
			}
			log.buildStepSuccess('published github release');
			return body;
		}).catch(e => {
			log.buildStepError('publishing github release', { after: e, exit: true });
			return e;
		});
	}
};

/* Export It!
 *************/
module.exports = Steps;
