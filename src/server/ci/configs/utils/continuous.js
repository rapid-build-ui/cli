/************************************
 * CI BUILD CONFIG: UTILS CONTINUOUS
 ************************************
 * - Arguments Array:
 *   0. RB_PROJECT_DIR
 *   1. RB_DIST_DIR: dist/server
 ************************************/
module.exports = args => { // config{}
	return {
		name: 'utils',
		paths: {
			dist: args[1],
			project: args[0]
			// dist: 'dist/server',
			// project: '/Users/jyounce/dev/packages/rapid-build-ui/utils'
		}
	}
};