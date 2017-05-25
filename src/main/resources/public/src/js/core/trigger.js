(function (context) {
	var handlers = { };
	function _eachHandler (eventName, fn) {
		var arr = handlers[eventName];
		if (F.isArray(arr)) {
			for (var i=0, l=arr.length; i<l; i++) {
				if (fn(arr[i], i) === false) {
					break;
				}
			}
		}
	}
	function _on (eventName, fn) {
		var ts = + new Date();
		if (F.isUndefined(handlers[eventName])) {
			handlers[eventName] = [ ];
		}
		handlers[eventName].push({
			fn: fn,
			ts: ts
		});
		return ts;
	}
	function _off (eventName, ts) {
		_eachHandler(eventName, function (token, i) {
			if (token.ts === ts) {
				handlers[eventName].splice(i, 1);
				return false;
			}
		});
	}
	function _trigger (eventName, data) {
		_eachHandler(eventName, function (token, i) {
			token.fn(data);
		});		
	}

	context.on = _on;
	context.off = _off;
	context.trigger = _trigger;

})(F);