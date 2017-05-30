F.define(
	'components/module', 
	'components/router',
	'plain!./templates/index.html', 
	'core/trigger',
function (Module, Router, tpl) {
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