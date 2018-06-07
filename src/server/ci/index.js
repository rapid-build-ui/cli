/*******************
 * CI BUILD UTILITY
 *******************/
require('../common/bootstrap/colors');
const ci  = require('./api');
const log = require('../common/logging/log');

!async function() { // :Promise<any>
	const args   = process.argv.slice(2); // ex: ['component', 'release']
	const type   = args[0];               // ex: component
	const step   = args[1];               // ex: release
	const config = require('./config')(); // getConfig()
	// log.pretty(config, { prefix: 'CONFIG', exit: true });
	await ci[type][step](config); // ex: ci.component.release(config);
	console.log('\n');
}();