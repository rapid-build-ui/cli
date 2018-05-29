/************
 * CI BUILDS
 ************/
const ci = require('./steps/ci-steps');

const CI = {
	components: {
		async continuous(config) { // :Promise<any>
			await ci.common.buildDist(config.paths);
			await ci.common.copyRootFilesToDist(config.paths);
			await ci.component.triggerShowcaseBuild(config.repoName, config.tokens);
		},
		async release(config) { // :Promise<any>
			await ci.common.buildDist(config.paths);
			await ci.common.copyRootFilesToDist(config.paths);
		}
	},
	utils: {
		async continuous(config) { // :Promise<any>
			await ci.common.copyRootFilesToDist(config.paths);
		},
		async release(config) { // :Promise<any>
			await ci.common.copyRootFilesToDist(config.paths);
		}
	}
};

/* Export It!
 *************/
module.exports = CI;