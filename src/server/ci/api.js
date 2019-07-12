/************
 * CI BUILDS
 ************/
const ci = require('./steps');

const CI = { // :Promise<any> (all return)
	cli: {
		async continuous(config) {
			await ci.common.copyRootFilesToDist(config, 'server');
		},
		async release(config) {
			await ci.common.copyRootFilesToDist(config, 'server');
			await ci.common.copyNpmConfigToDist(config, 'server');
			await ci.common.publishNpmPkg(config, 'server');
			await ci.common.publishGithubRelease(config);
		}
	},
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
			await ci.common.publishGithubRelease(config);
		}
	},
	showcase: {
		async continuous(config) {
			await ci.showcase.createDirForClonedComponents(config);
			await ci.showcase.cloneComponentRepos(config);
			await ci.showcase.setupComponents(config);
			await ci.showcase.setupShowcase(config);
			await ci.common.buildDist(config);
			await ci.showcase.createHerokuPkgJson(config);
			await ci.showcase.publishHerokuApp(config, 'dev');
		},
		async release(config) {
			await ci.showcase.installClient(config);
			await ci.showcase.installServer(config);
			await ci.common.buildDist(config);
			await ci.showcase.createHerokuPkgJson(config);
			await ci.showcase.publishHerokuApp(config, 'staging');
			await ci.common.publishGithubRelease(config);
		}
	}
};

/* Export It!
 *************/
module.exports = CI;