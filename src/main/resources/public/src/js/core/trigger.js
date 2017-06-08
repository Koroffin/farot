(function (context) {
    'use strict';
    var handlers = { },
        OffHandler;


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
        return new OffHandler(eventName, ts);
    }
    function _trigger (eventName, data) {
        _eachHandler(eventName, function (token, i) {
            token.fn(data);
        });
    }
    function _off (eventName, ts) {
        _eachHandler(eventName, function (token, i) {
            if (token.ts === ts) {
                handlers[eventName].splice(i, 1);
                return false;
            }
        });
    }

    OffHandler = function (eventName, ts) {
        this.ts = ts;
        this.eventName = eventName;
        return this;
    };
    OffHandler.prototype.off = function () {
        _off(this.eventName, this.ts);
    };

    context.on = _on;
    context.trigger = _trigger;

})(F);
