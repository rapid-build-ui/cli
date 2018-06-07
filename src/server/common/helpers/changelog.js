/*******************
 * CHANGELOG HELPER
 *******************/
const fse = require('fs-extra');

/* API
 ******/
const Changelog = {
	/* REGEX UNESCAPED: /^(?:#{1,2} \[5\.0\.3\].*)(?:([\s\S]+?)(?:#{1,2} \[\d\.\d\.\d\].*)|([\s\S]*))$/m
	 * 1. escape dots in version: 0\.0\.2
	 * 2. escape regx for new RegExp()
	 * 3. capture groups from changelog.match(regx)
	 *   - matches[1] = content between 2 entries
	 *   - matches[2] = content between 1 entry
	 * ********************************************/
	async getEntry(dirPath, version) { // :Promise<string|undefined>
		if (!version) return;
		version = version[0] === 'v' ? version.split('v')[1] : version;
		const _path  = `${dirPath}/CHANGELOG.md`;
		const exists = await fse.pathExists(_path);
		if (!exists) return;
		const changelog = await fse.readFile(_path, 'utf8'); // utf8 to return string
		const vEscaped  = version.replace(/\./g,'\\$&');
		const regx      = new RegExp(`^(?:#{1,2} \\[${vEscaped}\\].*)(?:([\\s\\S]+?)(?:#{1,2} \\[\\d\\.\\d\\.\\d\\].*)|([\\s\\S]*))$`, 'm');
		const matches   = changelog.match(regx);
		if (!matches) return;
		const match = (matches[1] || matches[2]).trim();
		if (!match) return;
		return match;
	}
};

/* Export It!
 *************/
module.exports = Changelog;
