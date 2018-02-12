F.define(
    'handlers/form',
    'handlers/a',
    'classes/component/component',
    'core/assign',
    'core/create',
function (FormHandler, AHandler, Component) {
    'use strict';
    var previousModule;

    function Module (options) {
        return Component.call(this, options);;
    }

    Module.prototype = F.assign(F.create(Component.prototype), {
        constructor: Component,
        start: function (data, callback) {
            var me = this;
            this.stop();
            previousModule = this;
            this.render(function (element) {
                me.append();
                if (F.isFunction(me.options.afterStart)) {
                    me.options.afterStart(me, data, callback);
                } else {
                    callback();
                }
            });
        },

        append: function () {
            F.root.appendChild(this.element);
            return this;
        },
        remove: function () {
            F.root.removeChild(this.element);
            return this;
        },

        initHandlers: function () {
            this.handlers = [
                new FormHandler(this.element),
                new AHandler(this.element)
            ];
        },

        stop: function () {
            if (previousModule) {
                previousModule.destroy();
            }
        },
        destroy: function () {
            this
                .destroyHandlers()
                .remove()
                .afterDestroy();
        }
    });

    return Module;
});
