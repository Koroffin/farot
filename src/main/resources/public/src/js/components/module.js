F.define('handlers/form', function (FormHandler) {

	var previousModule;

	function Module (options) {
		this.options = options;
		return this;
	}

	function start (data, callback) {
		this.stop();
		previousModule = this;
		this.el = this.render();

		this.handlers = [
			new FormHandler(this.el)
		];

		F.root.appendChild(this.el);

		F.isFunction(this.options.afterStart) ? this.options.afterStart(this, data, callback) : callback();
	}
	function render () {
		var container = document.createElement('div');
		container.innerHTML = this.options.tpl;
		return container;
	}
	function stop () {
		previousModule && previousModule.destroy();
	}
	function destroy () {
		for (var i=0, l=this.handlers.length; i<l; i++) {
			this.handlers[i].destroy();
		}
		F.isFunction(this.options.afterDestroy) && this.options.afterDestroy();
	}

	Module.prototype.start = start;
	Module.prototype.render = render;
	Module.prototype.stop = stop;
	Module.prototype.destroy = destroy;

	return Module;
});