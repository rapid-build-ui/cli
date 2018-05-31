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
	pkgs(pkgDirs, newVersion) { // :Promise[{}]
		log.buildStepBegin(`BUMPING VERSION TO v${newVersion}`, { matchCase: true });
		let promises = [];
		const cmd    = `npm version ${newVersion} --no-git-tag-version`;
		for (const [loc, dir] of Object.entries(pkgDirs)) {
			const opts    = { cwd: dir };
			const promise = exec(cmd, opts);
			promises.push(promise);
		}
		return Promise.all(promises).then(results => {
			const _newVersion = results[0].stdout.trim();
			log.buildStepSuccess(`BUMPED VERSION ${_newVersion}`, { matchCase: true });
			const locs = Object.keys(pkgDirs);
			for (const [i, result] of results.entries()) {
				const pkgPath = `${pkgDirs[locs[i]]}/package.json`;
				console.log(`${i+1}. ${pkgPath}`.info)
			}
			return results;
		}).catch(e => {
			log.buildStepError(`bumping version`, { after: e, exit: true });
		});
	},

	validate(versions) { // :{}
		let result = {
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
	getNewVersion(versions) { // :string (semver version)
		const result = Bump.validate(versions);
		return result.newVersion;
	},
	async versions(pkgDirs, versions) { // :Promise<any>
		await Bump.pkgs(pkgDirs, versions.new);
	}
};


/* Export It!
 *************/
module.exports = Api;