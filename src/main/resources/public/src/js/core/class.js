(function (context) {
    'use strict';
    function hasClass (el, className) {
        return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(el.className);
    }
    function addClass (el, className) {
        if (!hasClass(el, className)) {
            el.className += ' ' + className;
        }
    }
    function removeClass (el, className) {
        el.className = el.className.replace(new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g'), '');
    }

    context.addClass = addClass;
    context.removeClass = removeClass;
    context.hasClass = hasClass;

})(F);
