/***************************
 * RAPID BUILD UI UTILITIES
 ***************************/
require('./bootstrap/colors');

const Utils = {
	travis: {
		components: {
			async continuous(config) { // :Promise{}
				const steps = require('./travis/component-steps');
				await steps.buildComponent(config.paths);
				await steps.triggerShowcaseBuild(config.tokens.travis, config.repoName);
			}
		}
	}
};

/* Export It!
 *************/
module.exports = Utils;