/**********************
 * PACKAGE.JSON HELPER
 **********************/
const Pkg = {
	getPkg(dirPath) { // :{}
		return require(`${dirPath}/package.json`);
	},
	getVersion(dirPath, prefix=false) { // :string
		const version = this.getPkg(dirPath).version;
		return prefix ? this.prefixVersion(version) : version;
	},
	prefixVersion(version) { // :string (ex: v0.0.2)
		const prefix = 'v';
		if (!version) return version;
		if (version[0].toLowerCase() === prefix) return version;
		return `${prefix}${version}`;
	},
	deprefixVersion(version) { // :string (ex: 0.0.2)
		const prefix = 'v';
		if (!version) return version;
		if (version[0].toLowerCase() !== prefix) return version;
		return version.substring(1);
	}
};

/* Export It!
 *************/
module.exports = Pkg;
