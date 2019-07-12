/*********************
 * RAPID BUILD UI CLI
 *********************/
require('./common/bootstrap/colors');

/* CLI
 ******/
const CLI = {
	bump: require('./bump/api'),
	ci:   require('./ci/api')
};

/* Export It!
 *************/
module.exports = CLI;