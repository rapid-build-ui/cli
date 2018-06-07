/************
 * CI BUILDS
 ************/
const ci = require('./steps');

const CI = { // :Promise<any> (all return)
	component: {
		async continuous(config) {
			await ci.common.buildDist(config);
			await ci.common.copyRootFilesToDist(config, 'client');
			await ci.component.triggerShowcaseBuild(config);
		},
		async release(config) {
			await ci.common.buildDist(config);
			await ci.common.copyRootFilesToDist(config, 'client');
			await ci.common.copyNpmConfigToDist(config, 'client');
			await ci.common.publishNpmPkg(config, 'client');
			await ci.common.publishGithubRelease(config, 'client');
		}
	},
	utils: {
		async continuous(config) {
			await ci.common.copyRootFilesToDist(config, 'server');
		},
		async release(config) {
			await ci.common.copyRootFilesToDist(config, 'server');
			await ci.common.copyNpmConfigToDist(config, 'server');
			await ci.common.publishNpmPkg(config, 'server');
			await ci.common.publishGithubRelease(config, 'server');
		}
	},
	// TODO: Next!
	showcase: {
		async continuous(config) {},
		async release(config) {}
	}
};

/* Export It!
 *************/
module.exports = CI;