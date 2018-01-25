(function (context) {
    'use strict';

    function _parent (element, tagName) {
        var res = element.parentNode;
        tagName = tagName.toLowerCase();
        if (F.isDefined(tagName)) {
            while (res && res.tagName.toLowerCase() !== tagName) {
                res = res.parentNode;
            }
        }
        return res;
    }

    context.parent = _parent;
})(F);
