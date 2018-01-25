(function (context) {
    'use strict';
    function getAttr (ele, attr) {
        var result = (ele.getAttribute && ele.getAttribute(attr)) || undefined;
        if( !result ) {
            var attrs = ele.attributes;
            var length = attrs.length;
            for(var i = 0; i < length; i++) {
                if(attrs[i].nodeName === attr) {
                    result = attrs[i].nodeValue;
                }
            }
        }
        return result;
    }

    function setAttr (ele, attr, value) {
        ele.setAttribute(attr, value);
    }

    context.getAttr = getAttr;
    context.setAttr = setAttr;
})(F);
