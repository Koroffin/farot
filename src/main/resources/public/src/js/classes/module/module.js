F.define(
    'handlers/form',
    'handlers/a',
    './componentsRender',
    'core/assign',
function (FormHandler, AHandler, componentsRender) {
    'use strict';
    var previousModule;

    function Module (options) {
        this.options = options;
        return this;
    }
    Module.prototype = F.assign({
        start: function (data, callback) {
            var me = this;
            this.stop();
            previousModule = this;
            this.render(function (element) {
                me.el = element;
                me.handlers = [
                    new FormHandler(me.el),
                    new AHandler(me.el)
                ];

                me.append();

                if (F.isFunction(me.options.afterStart)) {
                    me.options.afterStart(me, data, callback);
                } else {
                    callback();
                }
            });
        },
        append: function () {
            F.root.appendChild(this.el);
        },
        render: function (callback) {
            this.renderComponents(callback);
            return this;
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
    }, componentsRender);

    return Module;
});
