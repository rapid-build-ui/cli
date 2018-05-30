/*************************************
 * CI BUILD CONFIG: COMPONENT RELEASE
 *************************************
 * - Arguments Array:
 *   0. RB_PROJECT_DIR
 *   1. RB_DIST_DIR: dist/client
 *************************************/
module.exports = args => { // config{}
	return {
		name: 'component',
		paths: {
			// dist: args[1],
			// project: args[0]
			dist: 'dist/server',
			project: '/Users/jyounce/dev/packages/rapid-build-ui/rb-alert'
		}
	}
};