F.define(
    'handlers/form',
    'handlers/a',
function (FormHandler, AHandler) {
    'use strict';
    var previousModule;

    function Module (options) {
        this.options = options;
        return this;
    }
    Module.prototype = {
        start: function (data, callback) {
            this.stop();
            previousModule = this;
            this.el = this.render();

            this.handlers = [
                new FormHandler(this.el),
                new AHandler(this.el)
            ];

            F.root.appendChild(this.el);

            if (F.isFunction(this.options.afterStart)) {
                this.options.afterStart(this, data, callback);
            } else {
                callback();
            }
        },
        render: function () {
            var container = document.createElement('div');
            container.innerHTML = this.options.tpl;
            return container;
        },
        stop: function () {
            if (previousModule) {
                previousModule.destroy();
            }
        },
        destroy: function () {
            for (var i=0, l=this.handlers.length; i<l; i++) {
                this.handlers[i].destroy();
            }

            F.root.removeChild(this.el);

            if (F.isFunction(this.options.afterDestroy)) {
                this.options.afterDestroy();
            }
        }
    };

    return Module;
});
