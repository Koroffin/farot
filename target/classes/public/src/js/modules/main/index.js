F.define('components/router', function (Router) {
    'use strict';
    Router.state('login');
    Router.state('game');
    Router.state('registration');

    Router.overwise(function () {
        F.api('account/auth/').then(function (res) {
            if (res.success === 0) {
                Router.navigate('login');
            } else {
                Router.navigate('game', res.data);
            }
        });
    });

    return {
        start: function () {
            Router.start();
        }
    };
});
