/************
 * CI BUILDS
 ************/
const ci = require('./steps');

const CI = {
	component: {
		async continuous(config) { // :Promise<any>
			await ci.common.buildDist(config.paths, config.name);
			await ci.common.copyRootFilesToDist(config.paths);
			await ci.component.triggerShowcaseBuild(config.repoName, config.tokens);
		},
		async release(config) { // :Promise<any>
			await ci.common.buildDist(config.paths, config.name);
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