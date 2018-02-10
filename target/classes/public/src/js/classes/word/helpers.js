F.define(function () {
	'use strict';

	function plus (a, b) {
		return b + a;
	}
	function minus (a, b) {
		return b - a;
	}
	function divide (a, b) {
		return b / a;
	}
	function multi (a, b) {
		return b * a;
	}
	function mod (a, b) {
		return b % a;
	}
	function logicalNot (a) {
		return !a;
	}
	function logicalAnd (a, b) {
		return b && a;
	}
	function logicalOr (a, b) {
		return b || a;
	}
	function equal (a, b) {
		return b == a;
	}
	function strictEqual (a, b) {
		return b === a;
	}
	function more (a, b) {
		return b > a;
	}
	function moreOrEqual (a, b) {
		return b >= a;
	}
	function less (a, b) {
		return b < a;
	}
	function lessOrEqual (a, b) {
		return b <= a;
	}
	function condition (a, b, c) {
		return c ? b : a;
	}
	function dot (a, b) {
		var result = b[a];
		if (F.isFunction(result)) {
			return {
				_caller: result,
				context: b
			};
		} else {
			return result;
		}
	}
	function fn () {
		if (F.isEmpty(arguments)) {
			return F.error('Can not call function without name!');
		}

		F.debug('here try to call function with arguments ', arguments);

		var args = F.cloneArray(arguments),
			_fn = args.pop();
		return _fn._caller.apply(_fn.context, args);
	}

	return {
		plus: plus,
		minus: minus,
		divide: divide,
		multi: multi,
		mod: mod,
		logicalOr: logicalOr,
		logicalAnd: logicalAnd,
		logicalNot: logicalNot,
		equal: equal,
		strictEqual: strictEqual,
		more: more,
		moreOrEqual: moreOrEqual,
		less: less,
		lessOrEqual: lessOrEqual,
		condition: condition,
		dot: dot,
		fn: fn
	};
});