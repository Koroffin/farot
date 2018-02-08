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
		return b[a];
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
		dot: dot
	};
});