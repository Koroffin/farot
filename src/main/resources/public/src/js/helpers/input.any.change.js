F.define('core/events', function () {
    'use strict';

    var InputAnyChange;

    InputAnyChange = function  (el, fn, isInstantCall) {
        this.handlers = [
            F.addEvent(el, 'change', fn),
            F.addEvent(el, 'cut', fn),
            F.addEvent(el, 'paste', fn),
            F.addEvent(el, 'keydown', fn)
        ];

        if (isInstantCall) {
            fn({
                target: el
            });
        }
    };
    InputAnyChange.prototype = {
        destroy: function () {
            var handlers = this.handlers;
            for (var i=0, l=handlers.length; i<l; i++) {
                F.removeEvent(handlers[i]);
            }
        }
    };


    return InputAnyChange;

});
