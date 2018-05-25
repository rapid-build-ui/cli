/******************
 * CONSOLE ALIASES
 ******************/
const Aliases = {
	log:   console.log.bind(console),
	info:  console.info.bind(console),
	error: console.error.bind(console)
};

/* Export It!
 *************/
module.exports = Aliases;