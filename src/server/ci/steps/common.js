/******************
 * CI COMMON STEPS
 ******************/
const util = require('util');
const cpy  = require('cpy');
const exec = util.promisify(require('child_process').exec);
const log  = require('../../logging/log');

/* Steps
 ********/
const Steps = {
	buildDist(paths) { // :Promise{}
		log.buildStepBegin('building dist');
		const cmd  = 'rapid-build prod';
		const opts = { cwd: paths.project };
		return exec(cmd, opts).then(results => {
			log.buildStepSuccess('built dist', { before: results.stdout, trim: { before: true }});
			return results;
		}).catch(e => {
			log.buildStepError('building dist', { after: e, exit: true });
			return e;
		});
	},

	copyRootFilesToDist(paths) { // :Promise<number> (total copied files)
		log.buildStepBegin(`copying root files to ${paths.dist}`);
		const src  = ['.npmignore', 'LICENSE', 'CHANGELOG.md', 'README.md'];
		const dest = paths.dist;
		const opts = { cwd: paths.project };
		return cpy(src, dest, opts).then(results => {
			const total = results.length;
			log.buildStepSuccess(`copied ${total} project root files to ${paths.dist}`);
			return total;
		}).catch(e => {
			log.buildStepError(`copying project root files to ${paths.dist}`, { after: e, exit: true });
			return e;
		});
	}
};

/* Export It!
 *************/
module.exports = Steps;
