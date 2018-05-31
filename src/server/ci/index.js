/*******************
 * CI BUILD UTILITY
 *******************/
require('../common/bootstrap/colors');
const ci = require('./api');

!async function() { // :Promise<any>
	const args       = process.argv.slice(2);        // ex: ['component', 'release', cli args...]
	const type       = args[0];                      // ex: 'component'
	const step       = args[1];                      // ex: 'release'
	const cliArgs    = args.slice(2);                // ex: [cli args...]
	const configPath = `./configs/${type}/${step}`;  // ex: ./configs/component/release
	const config     = require(configPath)(cliArgs); // ex: getConfig(cliArgs)
	await ci[type][step](config);                    // ex: ci.component.release(config);
}();