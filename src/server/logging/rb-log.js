/**********************
 * RAPID BUILD LOGGING
 **********************/
const template = require('./template-tags');
const { log, info, error } = require('./console');

/* Helpers
 **********/
const Helpers = {
	getAfter(opts) { // string | null
		let after = opts.after || null;
		if (after && opts.trim && opts.trim.after) after = after.trim();
		return after;
	},
	getBefore(opts) { // string | null
		let before = opts.before || null;
		if (before && opts.trim && opts.trim.before) before = before.trim();
		return before;
	}
}

/* API (all return void)
 ******/
const Log = {
	buildStepBegin(msg, opts={}) {
		log();
		const after  = Helpers.getAfter(opts);
		const before = Helpers.getBefore(opts);
		if (before) log(before);
		info(template.separate`begin ${msg}`.toUpperCase().alert);
		if (after) log(after);
	},

	buildStepError(msg, opts={}) {
		const exit   = opts.exit;
		const after  = Helpers.getAfter(opts);
		const before = Helpers.getBefore(opts);
		if (before) log(before);
		error(template.separate`✘ error ${msg}`.toUpperCase().error);
		if (after) log(after);
		if (exit) process.exit(1);
		log();
	},

	buildStepSuccess(msg, opts={}) {
		const after  = Helpers.getAfter(opts);
		const before = Helpers.getBefore(opts);
		if (before) log(before);
		info(template.separate`✔ ${msg}`.toUpperCase().alert);
		if (after) log(after);
		log();
	}
}

/* Export It!
 *************/
module.exports = Log;