/***************************
 * RAPID BUILD UI UTILITIES
 ***************************/
require('./bootstrap/colors');

const Utils = {
	travis: {
		components: {
			async continuous(config) { // :Promise<any>
				const steps = require('./travis/component-steps');
				await steps.buildComponent(config.paths);
				await steps.triggerShowcaseBuild(config.tokens.travis, config.repoName);
			},

			async release(config) { // :Promise<any>
				const steps = require('./travis/component-steps');
				await steps.buildComponent(config.paths);
			}
		}
	}
};

/* Export It!
 *************/
module.exports = Utils;