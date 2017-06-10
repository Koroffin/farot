(function (context) {
    'use strict';
    function _val (el) {
        if ((el.type === 'text') || (el.type === 'password')) {
            return el.value;
        }
    }

    context.val = _val;
})(F);
