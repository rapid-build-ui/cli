/**********************************
 * CI CONTINUOUS BUILD: COMPONENTS
 **********************************
 * - Arguments Array:
 *   0. RB_PROJECT_DIR
 *   1. RB_DIST_DIR: dist/client
 *   2. RB_REPO_NAME
 *   3. TRAVIS_TOKEN
 **********************************/
!async function() {
	const args   = process.argv.slice(2);
	const { ci } = require('../../../index');
	await ci.components.continuous({
		repoName: args[2],
		paths: {
			// dist: args[1],
			// project: args[0]
			dist: 'dist/client',
			project: '/Users/jyounce/dev/packages/rapid-build-ui/rb-alert'
		},
		tokens: {
			travis: args[3]
		}
	});
}();