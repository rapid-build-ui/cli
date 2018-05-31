/**********************
 * CHANGELOG GENERATOR
 **********************/
const fse       = require('fs-extra');
const changelog = require('conventional-changelog');
const log       = require('../common/logging/log');

/* Changelog
 ************/
const Changelog = {
	getChanges(config) { // :Promise<string>
		return new Promise((resolve, reject) => {
			log.buildStepBegin(`generating changelog`);
			let changes = '';
			const opts  = {
				preset: 'angular', // reads version from root package.json
				// releaseCount: 0,                         // create all changelog
				// pkg: { path: 'src/server/package.json' } // for specific package.json
			};
			changelog(opts).on('data', change => {
				change   = change.toString();
				change   = change.replace(/<a name.*?<\/a>\n/g, ''); // remove version anchor
				changes += change;
			})
			.on('error', e => {
				log.buildStepError(`getting changelog data`, { after: e });
				reject(e);
			})
			.on('end', () => {
				log.buildStepSuccess(`received changelog data`);
				resolve(changes);
			});
		});
	},
	async update(changes) { // :Promise<boolean>
		const _path   = 'CHANGELOG.md'; // in project root
		await fse.ensureFile(_path);
		let changelog = await fse.readFile(_path, 'utf8'); // utf8 to return string
		changelog     = changelog.trimLeft();
		let msg       = '';
		let update    = true;
		switch (true) {
			case changelog.startsWith(changes.split('\n')[0]): // skip, no changes
				msg    = 'changelog skipped, no changes';
				update = false;
				break;
			case !changelog: // new changelog
			case changelog.startsWith('# CHANGELOG'):
				msg = 'created changelog';
				break;
			default: // prepend changes
				msg = 'updated changelog';
				changes += changelog;
		}
		if (update) await fse.outputFile(_path, changes);
		log.buildStepSuccess(msg);
		return update;
	}
}

/* API
 ******/
const Api = {
	async update(config={}) { // :Promise<boolean>
		const changes = await Changelog.getChanges(config);
		const updated = await Changelog.update(changes);
		return updated;
	}
};


/* Export It!
 *************/
module.exports = Api;