/***************
 * BUMP VERSION
 ***************/
const bump      = require('./bump');
const changelog = require('./changelog');
const getConfig = require('./config'); // getConfig()
const log       = require('../common/logging/log');

/* Bump
 *******/
const Bump = {
	async run(type, bumpVersion) { // :Promise<any>
		const config = getConfig(type, bumpVersion);
		// log.pretty(config, { prefix: 'CONFIG', exit: true });
		await bump.versions(config);
		await changelog.update();
	},
};

/* Export It!
 *************/
module.exports = Bump;