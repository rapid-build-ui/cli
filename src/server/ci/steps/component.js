/*********************
 * CI COMPONENT STEPS
 *********************/
const util    = require('util');
const request = require('request');
const post    = util.promisify(request.post);
const log     = require('../../common/logging/log');

/* API
 ******/
const Steps = {
	triggerShowcaseBuild(config) { // :Promise{}
		const { repo, tokens } = config;
		log.buildStepBegin('triggering showcase build');
		const slug = `${repo.owner}%2Frapid-build-ui.io` // showcase repo slug formatted for travis api
		const url  = `https://api.travis-ci.org/repo/${slug}/requests`;
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
					message: `REBUILD TRIGGERED - ${repo.name}`
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
