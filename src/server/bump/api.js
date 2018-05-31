/***************
 * BUMP VERSION
 ***************/
const bump      = require('./bump');
const changelog = require('./changelog');

/* Helpers
 **********/
const Helpers = {
	getVersions(config, bumpVersion) { // :{}
		const rootPkg = require(`${config.pkgDirs.root}/package.json`);
		let versions  = {
			current: rootPkg.version,
			new:     null,
			bump:    bumpVersion
		}
		versions.new = bump.getNewVersion(versions);
		return versions;
	},
	getConfig(type, bumpVersion) { // :{}
		let config      = require(`./configs/${type}`);
		config.versions = this.getVersions(config, bumpVersion);
		return config;
	}
}

/* Bump
 *******/
const Bump = {
	async run(type, bumpVersion) { // :Promise<any>
		const config = Helpers.getConfig(type, bumpVersion);
		await bump.versions(config.pkgDirs, config.versions);
		await changelog.update();
	},
};

/* Export It!
 *************/
module.exports = Bump;