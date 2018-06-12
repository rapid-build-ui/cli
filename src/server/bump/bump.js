/****************
 * BUMP VERSIONS
 ****************/
const util   = require('util');
const semver = require('semver');
const fse    = require('fs-extra');
const log    = require('../common/logging/log');
const exec   = util.promisify(require('child_process').exec);

/* Bump
 *******/
const Bump = {
	async pkgs(config) { // :Promise[{}]
		const { paths, versions } = config;
		const newVersion = versions.new;
		log.buildStepBegin(`BUMPING VERSION TO v${newVersion}`, { matchCase: true });
		const pkgDirPaths = {
			project: paths.abs.project,
			client:  paths.rel.src.client,
			server:  paths.rel.src.server
		}
		const promises = [];
		const cmd      = `npm version ${newVersion} --no-git-tag-version`;
		for (const [loc, pkgDirPath] of Object.entries(pkgDirPaths)) {
			const pkgPath = `${pkgDirPath}/package.json`;
			const exists  = await fse.pathExists(pkgPath);
			if (!exists) {
				delete pkgDirPaths[loc]
				continue;
			}
			const opts    = { cwd: pkgDirPath };
			const promise = exec(cmd, opts);
			promises.push(promise);
		}
		return Promise.all(promises).then(results => {
			const _newVersion = results[0].stdout.trim();
			log.buildStepSuccess(`BUMPED VERSION ${_newVersion}`, { matchCase: true });
			const locs = Object.keys(pkgDirPaths);
			for (const [i, result] of results.entries()) {
				const pkgPath = `${pkgDirPaths[locs[i]]}/package.json`;
				console.log(`${i+1}. ${pkgPath}`.info)
			}
			return results;
		}).catch(e => {
			log.buildStepError(`bumping version`, { after: e, exit: true });
		});
	},

	async showcaseVersionsFile(config) { // :Promise<boolean>
		const { paths, versions } = config;
		log.buildStepBegin(`updating showcase versions file`);
		const newVersion   = versions.new;
		const showcaseFile = paths.rel.src.showcaseFile;
		let newVersions = {
			showcase: newVersion,
			// components: {} TODO
		};
		try {
			let contents = await fse.readFile(showcaseFile, 'utf8');
				contents = contents.replace(
					/{[^]*?}(?![^]*?})/,
					JSON.stringify(newVersions, null, '\t')
				);
			await fse.writeFile(showcaseFile, contents);
			log.buildStepSuccess(`updated ${showcaseFile}`, { matchCase: true });
			return true;
		} catch(e) {
			log.buildStepError(`updating ${showcaseFile}`, { after: e, exit: true, matchCase: true });
			return e;
		}
	},

	validate(versions) { // :{}
		const result = {
			eMsg:  null,
			valid: true,
			newVersion: null
		};
		switch (true) {
			case !versions.current:
				result.valid = false;
				result.eMsg  = `Bump requires root package.json to have version.`;
				break;
			case !versions.bump:
				result.valid = false;
				result.eMsg  = `Bump requires a valid semver string or version.`;
				break;
			case /^[a-zA-Z]+$/.test(versions.bump):
				result.newVersion = semver.inc(versions.current, versions.bump);
				result.valid      = !!result.newVersion;
				if (!result.valid) result.eMsg = `Bump requires a valid semver string or version not "${versions.bump}".`;
				break;
			default:
				result.newVersion = semver.valid(versions.bump);
				result.valid      = !!result.newVersion;
				if (!result.valid) {
					result.eMsg = `Bump requires a valid semver string or version not "${versions.bump}".`;
					break;
				}
				result.valid = semver.gt(versions.bump, versions.current);
				if (!result.valid) {
					result.eMsg = `Bumped version "${versions.bump}" must be greater than current version "${versions.current}".`;
					result.newVersion = null;
				}
		}
		if (!result.valid) log.buildStepError(`bumping version`, { after: `${result.eMsg.error}\n`, exit: true });
		return result;
	}
}

/* API
 ******/
const Api = {
	getNewVersion(config) { // :string (semver version)
		const { versions } = config;
		const result = Bump.validate(versions);
		return result.newVersion;
	},

	async versions(config) { // :Promise<any>
		await Bump.pkgs(config);
		if (config.type !== 'showcase') return;
		await Bump.showcaseVersionsFile(config);
	}
};


/* Export It!
 *************/
module.exports = Api;