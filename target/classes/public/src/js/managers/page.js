F.define('core/class', function () {
    'use strict';
    function serve (name, data) {
        F.addClass(F.root, 'loading');
        F.require('modules/' + name, function (Module) {
            Module.start(data, function () {
                F.removeClass(F.root, 'loading');
            });
        });
    }

    return {
        serve: serve
    };
});
