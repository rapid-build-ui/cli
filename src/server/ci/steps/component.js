/*********************
 * CI COMPONENT STEPS
 *********************/
const util    = require('util');
const request = require('request');
const post    = util.promisify(request.post);
const log     = require('../../common/logging/log');

/* Steps
 ********/
const Steps = {
	triggerShowcaseBuild(repoName, tokens) { // :Promise{}
		log.buildStepBegin('triggering showcase build');
		repoName   = repoName.split('/')[1]; // ex: rapid-build-ui/rb-alert -> rb-alert
		const url  = 'https://api.travis-ci.org/repo/rapid-build-ui%2Frapid-build-ui.io/requests';
		const opts = {
			url,
			json: true,
			headers: {
				'travis-api-version': 3,
				'authorization': `token ${tokens.travis}`
			},
			body: {
				request: {
					branch:  'continuous',
					message: `REBUILD TRIGGERED - ${repoName}`
				}
			}
		};
		return post(opts).then(results => {
			log.buildStepSuccess('triggered showcase build');
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
