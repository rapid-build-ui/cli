/*******************
 * CI COMMON CONFIG
 *******************/
const getConfig = () => { // :{}
	try { require('./testing/ci-env-vars'); } catch(e) {}

	/* Begin
	 ********/
	const env      = process.env;
	const projPath = env.RB_PROJECT_PATH;
	const repoSlug = env.RB_REPO_SLUG;
	const repo     = repoSlug.split('/');

	/* Config
	 *********/
	const config = {
		repo: {
			name:  repo[1], // ex: rb-alert
			owner: repo[0], // rapid-build-ui
			slug:  repoSlug // ex: rapid-build-ui/rb-alert
		},
		tokens: { // travis web gui -> settings
			github: env.GITHUB_TOKEN, // all
			heroku: env.HEROKU_TOKEN, // showcase
			npm:    env.NPM_TOKEN,    // components and cli
			travis: env.TRAVIS_TOKEN  // components
		},
		paths: {
			abs: {
				project:    projPath,
				components: `${projPath}/.rb-components`, // showcase
				dist: {
					root:   `${projPath}/dist`,
					client: `${projPath}/dist/client`,
					server: `${projPath}/dist/server`
				},
				src: {
					root:   `${projPath}/src`,
					client: `${projPath}/src/client`,
					server: `${projPath}/src/server`
				}
			},
			rel: { // all relative to project path
				dist: {
					root:   'dist',
					client: 'dist/client',
					server: 'dist/server'
				},
				src: {
					root:   'src',
					client: 'src/client',
					server: 'src/server'
				}
			}
		}
	};

	return config;
};

/* Export It!
 *************/
module.exports = getConfig;