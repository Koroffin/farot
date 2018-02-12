F.define(
    'classes/module/module',
    'router',
    'plain!./templates/index.html',
    'core/trigger',
function (Module, Router, tpl) {
    'use strict';
    var GameModule;

    GameModule = new Module({
        tpl: tpl,
        afterStart: function (module, data, callback) {
            callback();
        },
        afterDestroy: function () {

        }
    });

    return GameModule;
});
