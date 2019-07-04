/******************
 * CI BUMP UTILITY
 ******************/
require('../common/bootstrap/colors');
const bump = require('./api');

!async function() { // :Promise<any>
	const args          = process.argv.slice(2); // ex: ['component', cli args...]
	const type          = args[0];               // ex: 'component'
	const cliArgs       = args.slice(1);         // ex: [cli args...]
	const bumpVersion   = cliArgs[0];            // ex: 1.0.0 or semver string (ex: patch)
	const extraBumpFile = cliArgs[1];            // ex: src/client/scripts/rb-alert.js
	await bump.run(type, bumpVersion, extraBumpFile); // ex: bump.run(component, 1.0.0, src/client/scripts/rb-alert.js);
	console.log('\n');
}();