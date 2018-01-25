(function (context) {
    'use strict';

    var trim;

    if (!String.prototype.trim) {
    	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	    trim = function (str) {
	        return str.replace(rtrim, '');
	    };
	} else {
		trim = function (str) {
			return str.trim();
		}
	}

    context.trim = trim;
})(F);
