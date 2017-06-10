F.define(
    'components/module',
    'components/router',
    'plain!./templates/main.html',
    'core/trigger',
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
                console.log('here res error: ', res);
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
