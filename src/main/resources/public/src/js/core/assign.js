(function (context) {
    'use strict';
    function _assign () {
       return Object.assign.apply(Object, arguments);
    }
    function _oldAssign (target, varArgs) {
        if (target == null) { // TypeError if undefined or null
            return null;
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    }

    context.assign = F.isFunction(Object.assign) ? _assign : _oldAssign;
})(F);
