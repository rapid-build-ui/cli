/***************************
 * RAPID BUILD UI UTILITIES
 ***************************/
require('./common/bootstrap/colors');

/* Utils
 ********/
const Utils = {
	bump: require('./bump/api'),
	ci:   require('./ci/api')
};

/* Export It!
 *************/
module.exports = Utils;