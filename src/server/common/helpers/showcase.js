/******************
 * SHOWCASE HELPER
 ******************/
const pkgHelp     = require('./pkg');
const log         = require('../logging/log');
const RB_PREFIX   = 'rapid-build-ui';
const SCOPED_NAME = `@${RB_PREFIX}`;
const REPO_PREFIX = `https://github.com/${RB_PREFIX}`

/* API
 ******/
const Showcase = {
	getComponents(pkgPath) { // :{}[]
		const pkg = pkgHelp.getPkg(pkgPath);
		const components = [];
		for (const [dep, version] of Object.entries(pkg.dependencies)) {
			if (!dep.includes(SCOPED_NAME)) continue;
			const name      = dep.replace(`${SCOPED_NAME}/`,'');
			const githubUrl = `${REPO_PREFIX}/${name}`;
			components.push({
				name,
				githubUrl
			});
		}
		// log.pretty(components, { prefix: 'COMPONENTS' });
		return components;
	}
}

/* Export It!
 *************/
module.exports = Showcase;
