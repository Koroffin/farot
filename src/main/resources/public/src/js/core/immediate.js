(function (context) {
    'use strict';
    function _fakeHandler (fn) {
        setTimeout(fn, 0);
    }

    context.immediate = (typeof setImmediate !== 'undefined') ? setImmediate : _fakeHandler;

})(F);
