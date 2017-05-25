(function (context) {

	function addClass (el, className) {
		if (!hasClass(el, className)) {
			el.className += ' ' + className;
		}
	}
	function removeClass (el, className) {
		el.className = el.className.replace(new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)", "g"), "");;
	}
	function hasClass (el, className) {
		return new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)").test(el.className);
	}

	context.addClass = addClass;
	context.removeClass = removeClass;
	context.hasClass = hasClass;

})(F);