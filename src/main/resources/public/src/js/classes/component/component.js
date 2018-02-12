F.define(
    './componentRender',
    'core/attr',
    'core/assign',
function (componentRender) {
    'use strict';
    function Component (options) {
        this.options = options;
        return this;
    }
    Component.prototype = F.assign({
        render: function (callback) {
            var me      = this,
                options = this.options;

            this.renderComponents(function (container) {
                me.element = container.firstChild;

                // DOM-свойства элемента
                if (F.isDefined(options.props)) {
                    for (var i = 0, l = options.props.length; i < l; i++) {
                        F.setAttr(me.element, options.props[i].name, options.props[i].value);
                    }
                }

                me.initHandlers();

                callback(me.element);
            });
            return this;
        },
        initHandlers: function () {
            this.handlers = [ ];
            if (F.isDefined(options.handlers)) {
                for (var i = 0, l = options.handlers.length; i < l; i++) {
                    this.handlers.push(
                        new options.handlers[i](this.element)
                    );
                }
            }
        },
        destroyHandlers: function () {
            for (var i = 0, l = this.handlers.length; i < l; i++) {
                this.handlers[i].destroy();
            }
            return this;
        },
        afterDestroy: function () {
            if (F.isFunction(this.options.afterDestroy)) {
                this.options.afterDestroy();
            }
            return this;
        },
        destroy: function () {
            this
                .destroyHandlers()
                .afterDestroy();
        }
    }, componentRender);
    return Component;
});