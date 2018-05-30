/***************************
 * RAPID BUILD UI UTILITIES
 ***************************/
require('./bootstrap/colors');

const Utils = {
	ci: require('./ci/ci-builds')
};

/* Export It!
 *************/
module.exports = Utils;