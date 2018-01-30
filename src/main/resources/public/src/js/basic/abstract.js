F.define(
    'core/attr',
function () {
    'use strict';
    function AbstractBasic (options) {
        this.options = options;
        return this;
    }
    AbstractBasic.prototype = {
        render: function () {
            var container, options;

            options = this.options;
            container = document.createElement('div');
            container.innerHTML = options.tpl;
            this.element = container.firstChild;

            // DOM-свойства элемента
            if (F.isDefined(options.props)) {
                for (var i = 0, l = options.props.length; i < l; i++) {
                    F.setAttr(this.element, options.props[i].name, options.props[i].value);
                }
            }
                
            // Обработчики событий
            this.handlers = [ ];
            if (F.isDefined(options.handlers)) {
                for (var i = 0, l = options.handlers.length; i < l; i++) {
                    this.handlers.push(
                        new options.handlers[i](this.element)
                    );
                }
            }
        },
        destroy: function () {
            for (var i = 0, l = this.handlers.length; i < l; i++) {
                this.handlers[i].destroy();
            }
            if (F.isFunction(this.options.afterDestroy)) {
                this.options.afterDestroy();
            }
        }
    };
    return AbstractBasic;
});