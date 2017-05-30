F.define('components/router', function (Router) {

	Router.state('login');
	Router.state('game');
	Router.state('registration');
	
	Router.overwise(function () {
		F.api('account/auth/').then(function (res) {
			(res.success === 0) ? Router.navigate('login') : Router.navigate('game', res.data);
		});
	});

	return {
		start: function () {
			Router.start();
		}
	};
});