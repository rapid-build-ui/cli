/********************************
 * CI CONTINUOUS BUILD: UTILS
 ********************************
 * - Arguments Array:
 *   0. RB_PROJECT_DIR
 *   1. RB_DIST_DIR: dist/server
 ********************************/
!async function() {
	const args   = process.argv.slice(2);
	const { ci } = require('../../../index');
	await ci.utils.continuous({
		paths: {
			// dist: args[1],
			// project: args[0]
			dist: 'dist/server',
			project: '/Users/jyounce/dev/packages/rapid-build-ui/utils'
		}
	});
}();