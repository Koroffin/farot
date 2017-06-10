F.define('components/router', 'core/events', 'core/attr', function (Router) {
    'use strict';
    var A;

    // private helpers
    function _onClick (e) {
        var data = F.getAttr(e.target, 'f-route-data');
        if (!F.isEmpty(data)) {
            data = JSON.parse(data);
        }
        Router.navigate(F.getAttr(e.target, 'f-route'), data);
        F.stopEvent(e);
    }
    function _processA (el) {
        var handle = F.addEvent(el, 'click', _onClick);
        return {
            click_handler: handle
        };
    }

    A = function (el) {
        var a = el.getElementsByTagName('a');
        this.handled = [ ];
        for (var i=0, l=a.length; i<l; i++) {
            if (!F.isEmpty(F.getAttr(a[i], 'f-route'))) {
                this.handled.push(_processA(a[i]));
            }
        }
    };
    A.prototype = {
        destroy: function () {
            var handled;
            for (var i=0, l=this.handled.length; i<l; i++) {
                handled = this.handled[i];
                F.removeEvent(handled.click_handler);
            }
        }
    };

    return A;
});
