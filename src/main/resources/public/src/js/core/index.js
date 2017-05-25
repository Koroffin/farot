(function (context) {

	function F () {

	}

	/*
		checkers for any case
	*/
	function isArray (obj) {
		return isDefined(obj) && (obj.constructor === Array);
	}
	function isExists (variable) {
		return typeof variable !== 'undefined';
	}
	function isUndefined (variable) {
		return variable === undefined;
	}
	function isDefined (variable) {
		return variable !== undefined;
	}
	function isEmpty (arr) {
		return isUndefined(arr) || (arr.length === 0);
	}
	function isFunction (variable) {
		return typeof variable === 'function';
	}
	function isDate (variable) {
		return variable instanceof Date;
	}
	function isObject (variable) {
		return variable instanceof Object;
	}
	function isString (variable) {
		return variable instanceof String;
	}

	/*
		null function
	*/
	function nope () {

	}

	/*
		crossbrowser error display
	*/
	var _console = isExists(console) ? console : window.console;
	function error (msg) {
		isObject(_console) && isFunction(_console.error) && _console.error(msg);
	}

	/* 
		array and object methods
	*/
	function last (arr) {
		return arr[arr.length-1];
	}
	function clone (obj) {
		var copy;

		// Handle functions
		if (isFunction(obj)) {
			return obj;
		}

		// Handle Date
	    if (isDate(obj)) {
	        copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array and arguments
	    if (isArray(obj)) {
	        return cloneArray(obj)
	    }

	    // Handle Object
	    if (isObject(obj)) {
	        copy = { };
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	        }
	        return copy;
	    }

	    return obj;
	}
	function cloneArray (arr) {
		var copy = [ ];
        for (var i = 0, len = arr.length; i < len; i++) {
            copy[i] = clone(arr[i]);
        }
        return copy;
	}

	/*
		async
	*/
	function Async (handlers) {
		var me = this;

		this.counter = 0;
		this.promise = promise();
		this.l = handlers.length;
		this.res = [ ];

		setTimeout(function () {
			if (me.l === 0) {
				me.promise.execute(me.res);
			} else {
				for (var i=0; i<me.l; i++) {
					me.res.push('');
					handlers[i](me.getCb(i));
				}
			}
		}, 0);

		return this;
	}
	Async.prototype.getCb = function (i) {
		var me = this;
		return function (data) {
			me.counter++;
			me.res[i] = data;
			(me.counter === me.l) && me.promise.execute(me.res);
		}		
	}
	function async (handlers) {
		return new Async(handlers);
	}

	/*
		ajax
	*/
	function send (url, postData) {
		var p = promise();

	    var req = createXMLHTTPObject();
	    if (!req) return;
	    var method = (postData) ? "POST" : "GET";
	    req.open(method,url,true);
	    (postData) && req.setRequestHeader('Content-type','application/json');
	    req.onreadystatechange = function () {
	        if (req.readyState != 4) return;
	        if (req.status != 200 && req.status != 304) {
	        	p.executeError(req);
	            return;
	        }

	        try {
	        	var json = JSON.parse(req.responseText);
	        	p.execute(json);
	        } catch (e) {
	        	p.execute(req);
	        }

	    }
	    if (req.readyState == 4) return;
	    req.send(JSON.stringify(postData));

	    return p;
	}
	var XMLHttpFactories = [
	    function () {return new XMLHttpRequest()},
	    function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	    function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	    function () {return new ActiveXObject("Microsoft.XMLHTTP")}
	];
	function createXMLHTTPObject () {
	    var xmlhttp = false;
	    for (var i=0;i<XMLHttpFactories.length;i++) {
	        try {
	            xmlhttp = XMLHttpFactories[i]();
	        }
	        catch (e) {
	            continue;
	        }
	        break;
	    }
	    return xmlhttp;
	}
	function api (url, postData) {
		return send('http://koroffin.com:4567/api/' + url, postData);
	}

	function promise () {
		return {
			isExecuted: false,
			isExecutedError: false,
			callbacks: [],
			errorbacks: [],
			result: undefined,
			then: function (fn) {
				this.isExecuted ? fn(this.result) : this.callbacks.push(fn);
				return this;
			},
			catch: function (fn) {
				this.isExecutedError ? fn(this.result) : this.errorbacks.push(fn);
				return this;
			},
			execute: function (result) {
				this.isExecuted = true;
				this.result = result;
				for (var i=0, l=this.callbacks.length; i<l; i++) {
					this.callbacks[i](result);
				}
			},
			executeError: function (result) {
				this.isExecutedError = true;
				this.result = result;
				for (var i=0, l=this.errorbacks.length; i<l; i++) {
					this.errorbacks[i](result);
				}
			}
		}
	}

	F.isEmpty     = isEmpty;
	F.isArray     = isArray;
	F.isUndefined = isUndefined;
	F.isDefined   = isDefined;
	F.isExists    = isExists;
	F.isFunction  = isFunction;
	F.isDate      = isDate;
	F.isObject    = isObject;
	F.isString    = isString;

	F.nope = nope;

	F.error = error;

	F.last       = last;
	F.clone      = clone;
	F.cloneArray = cloneArray;

	F.async = async;

	F.send    = send;
	F.api     = api;
	F.promise = promise;

	F.root = document.getElementById('root');

	context.F = F;

})(window);