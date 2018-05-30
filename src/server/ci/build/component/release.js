/********************************
 * CI RELEASE BUILD: COMPONENTS
 ********************************
 * - Arguments Array:
 *   0. RB_PROJECT_DIR
 *   1. RB_DIST_DIR: dist/client
 ********************************/
!async function() {
	const args   = process.argv.slice(2);
	const { ci } = require('../../../index');
	await ci.components.release({
		paths: {
			// dist: args[1],
			// project: args[0]
			dist: 'dist/client',
			project: '/Users/jyounce/dev/packages/rapid-build-ui/rb-alert'
		}
	});
}();