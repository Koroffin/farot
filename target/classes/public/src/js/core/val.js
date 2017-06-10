(function (context) {
    'use strict';
    function _val (el) {
        if (el.type === 'text') {
            return el.value;
        }
    }

    context.val = _val;
})(F);
