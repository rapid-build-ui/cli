/*********************
 * BUMP COMMON CONFIG
 *********************/
const bump    = require('./bump');
const pkgHelp = require('../common/helpers/pkg');

const getConfig = (type, bumpVersion) => { // :{}
	/* Begin
	 ********/
	const projPath = process.cwd();

	/* Config
	 *********/
	const config = {
		type,
		versions: {
			current: pkgHelp.getVersion(projPath),
			new:     null,
			bump:    bumpVersion
		},
		paths: {
			abs: {
				project: projPath,
			},
			rel: { // all relative to project path
				src: {
					client: 'src/client',
					server: 'src/server',
					showcaseFile: 'src/client/scripts/constants/versions-const.js'
				}
			}
		}
	};

	/* Update
	 *********/
	if (type !== 'showcase') delete config.paths.rel.src.showcaseFile;
	config.versions.new = bump.getNewVersion(config);

	return config;
};

/* Export It!
 *************/
module.exports = getConfig;