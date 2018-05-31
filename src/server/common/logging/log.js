/**********
 * LOGGING
 **********/
const template = require('./template-tags');
const { log, info, error } = require('./console');

/* Event Messages
 *****************/
EventMsgs = {
	begin:   'begin',
	error:   '✘ error',
	success: '✔ success'
}

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
	},
	getMsg(msg, opts) { // string
		msg = typeof msg !== 'string' ? '' : msg;
		msg = opts.matchCase ? msg : msg.toUpperCase();
		return msg;
	},
	getEventMsg(eKey, msg, opts) { // string
		msg    = this.getMsg(msg, opts);
		evtMsg = EventMsgs[eKey].toUpperCase()
		if (!!msg) evtMsg += `: ${msg}`;
		return evtMsg;
	},
	getOpts(msg, opts={}) { // string
		if (typeof msg !== 'string') return msg; // no msg only opts as 1st param
		return opts;
	}
}

/* API (all return void)
 ******/
const Log = {
	buildStepBegin(msg, opts={}) {
		log();
		opts = Helpers.getOpts(msg, opts);
		msg  = Helpers.getEventMsg('begin', msg, opts);
		const after  = Helpers.getAfter(opts);
		const before = Helpers.getBefore(opts);
		if (before) log(before);
		info(template.separate`${msg}`.alert);
		if (after) log(after);
	},
	buildStepError(msg, opts={}) {
		opts = Helpers.getOpts(msg, opts);
		msg  = Helpers.getEventMsg('error', msg, opts);
		const after  = Helpers.getAfter(opts);
		const before = Helpers.getBefore(opts);
		if (before) log(before);
		error(template.separate`${msg}`.error);
		if (after) log(after);
		if (opts.exit) process.exit(1);
		log();
	},
	buildStepSuccess(msg, opts={}) {
		opts = Helpers.getOpts(msg, opts);
		msg  = Helpers.getEventMsg('success', msg, opts);
		const after  = Helpers.getAfter(opts);
		const before = Helpers.getBefore(opts);
		if (before) log(before);
		info(template.unindent`${msg}`.success);
		if (after) log(after);
	}
}

/* Export It!
 *************/
module.exports = Log;