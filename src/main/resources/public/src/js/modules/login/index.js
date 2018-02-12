F.define(
    'classes/module/module',
    'router',
    'plain!./templates/main.html',
    'core/trigger',
    'css!./styles',
function (Module, Router, tpl) {
    'use strict';
    var LoginModule,
        offSubmitLoginFormSuccess, offSubmitLoginFormError;

    LoginModule = new Module({
        tpl: tpl,
        afterStart: function (module, data, callback) {
            offSubmitLoginFormSuccess = F.on('submit:LoginForm:success', function () {
                Router.navigate('game');
            });
            offSubmitLoginFormError = F.on('submit:LoginForm:error', function (res) {
                F.debug('here res error: ', res);
            });
            callback();
        },
        afterDestroy: function () {
            offSubmitLoginFormSuccess.off();
            offSubmitLoginFormError.off();
        }
    });

    return LoginModule;
});
