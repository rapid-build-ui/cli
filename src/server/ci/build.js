/*******************
 * CI BUILD UTILITY
 *******************/
!async function() { // :Promise<any>
	const { ci } = require('../index');
	const args       = process.argv.slice(2);        // ex: ['component', 'release', ci args...]
	const build      = args[0];                      // ex: 'component'
	const step       = args[1];                      // ex: 'release'
	const ciArgs     = args.slice(2);                // ex: [ci args...]
	const configPath = `./configs/${build}/${step}`; // ex: ./configs/component/release
	const config     = require(configPath)(ciArgs);  // ex: getConfig(ciArgs)
	await ci[build][step](config);                   // ex: ci.component.release(config);
}();