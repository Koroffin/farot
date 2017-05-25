F.define(
	'components/module', 
	'plain!./templates/main.html', 
	'core/trigger',
function (Module, tpl) {
	var LoginModule,
		offSubmitLoginFormSuccess, offSubmitLoginFormError;

	LoginModule = new Module({ 
		tpl: tpl,
		afterStart: function (module, data, callback) {
			offSubmitLoginFormSuccess = F.on('submit:LoginForm:success', function () {
				console.log('here res: ', res);
			});
			offSubmitLoginFormError = F.on('submit:LoginForm:error', function () {
				console.log('here res error: ', res);
			});
			callback();
		},
		afterDestroy: function () {
			F.off('submit:LoginForm:success', offSubmitLoginFormSuccess);
			F.off('submit:LoginForm:error', offSubmitLoginFormError);
		}
	});

	return LoginModule;
});