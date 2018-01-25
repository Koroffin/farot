F.define('components/router', function (Router) {
    'use strict';
    Router.state('login');
    Router.state('game');
    Router.state('registration');

    Router.overwise(function () {
        F.api('account/auth').then(function (res) {
            Router.navigate('game', res);
        }).catch(function () {
            Router.navigate('login');
        });
    });

    return {
        start: function () {
            Router.start();
        }
    };
});
