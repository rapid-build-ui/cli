/***************************
 * RAPID BUILD UI UTILITIES
 ***************************/
require('./bootstrap/colors');

const Utils = {
	ci: require('./ci/builds')
};

/* Export It!
 *************/
module.exports = Utils;