F.define(
    './componentRender',
    './state',
    './inject',
    'core/attr',
    'core/assign',
function (componentRender, State, inject) {
    'use strict';
    function Component (options) {
        this.options = options;
        this.initState();
        return this;
    }
    Component.prototype = F.assign({
        render: function (callback) {
            var me           = this,
                options      = this.options,
                generatedTpl = this.inject(options.tpl);

            this.renderComponents(generatedTpl, function (container) {
                me.element = container.firstChild;

                // DOM-свойства элемента
                if (F.isDefined(options.props)) {
                    for (var i = 0, l = options.props.length; i < l; i++) {
                        me.element[options.props[i].name] = options.props[i].value;
                    }
                }

                me.initHandlers();

                callback(me.element);
            });
            return this;
        },
        initHandlers: function () {
            this.handlers = [ ];
            if (F.isDefined(this.options.handlers)) {
                for (var i = 0, l = this.options.handlers.length; i < l; i++) {
                    this.handlers.push(
                        new this.options.handlers[i](this.element)
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
    }, componentRender, State, inject);
    
    return Component;
});