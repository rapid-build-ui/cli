/*******************************
 * TRAVIS COMPONENT BUILD STEPS
 *******************************/
const util    = require('util');
const cpy     = require('cpy');
const request = require('request');
const post    = util.promisify(request.post);
const exec    = util.promisify(require('child_process').exec);
const log     = require('../logging/rb-log');

/* Steps
 ********/
const Steps = {
	buildComponent(paths) { // :Promise{}
		log.buildStepBegin('component build');
		const cmd  = 'rapid-build prod';
		const opts = { cwd: paths.component };
		return exec(cmd, opts).then(results => {
			log.buildStepSuccess('component built', { before: results.stdout, trim: { before: true }});
			return results;
		}).catch(e => {
			log.buildStepError('building component', { after: e, exit: true });
			return e;
		});
	},

	copyRootFilesToDist(paths) { // :Promise<number> (total copied files)
		log.buildStepBegin('copy root files to dist client');
		const src  = ['.npmignore', 'LICENSE', 'CHANGELOG.md', 'README.md'];
		const dest = 'dist/client';
		const opts = { cwd: paths.component };
		return cpy(src, dest, opts).then(results => {
			const total = results.length;
			log.buildStepSuccess(`copied ${total} root files to dist client`);
			return total;
		}).catch(e => {
			log.buildStepError('copying root files to dist client', { after: e, exit: true });
			return e;
		});
	},

	triggerShowcaseBuild(travisToken, repoName) { // :Promise{}
		log.buildStepBegin('showcase build trigger');
		repoName   = repoName.split('/')[1]; // ex: rapid-build-ui/rb-alert -> rb-alert
		const url  = 'https://api.travis-ci.org/repo/rapid-build-ui%2Frapid-build-ui.io/requests';
		const opts = {
			url,
			json: true,
			headers: {
				'travis-api-version': 3,
				'authorization': `token ${travisToken}`
			},
			body: {
				request: {
					branch:  'continuous',
					message: `REBUILD TRIGGERED - ${repoName}`
				}
			}
		};
		return post(opts).then(results => {
			log.buildStepSuccess('showcase build triggered');
			return results;
		}).catch(e => {
			log.buildStepError('triggering showcase build', { after: e, exit: true });
			return e;
		});
	}
};

/* Export It!
 *************/
module.exports = Steps;
