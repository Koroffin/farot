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
        _renderComponent: function(componentName, tpl) {

        },
        _requireComponent: function() {

        },
        render: function () {
            var container, tpl, 
                re, match, matchStr, matchIndex, matchAttributes, matchAttribute,
                componentsHash, componentPath, componentAttributes, componentAttribute;

            container = document.createElement('div');
            tpl = this.options.tpl;
            componentsHash = { };

            // Проверяем на компоненты
            re = /<f-([^>]+)\s*>/gi;
            while ((match = re.exec(tpl)) !== null) {
                matchIndex = match.index;
                matchStr = match[1].replace(/(\s{2,})|\n|\t/gi, ' ');
                matchAttributes = matchStr.split(' ');

                console.log('match custom component: ', matchStr, matchIndex);
                console.log('test index: ', tpl[matchIndex] + tpl[matchIndex + 1] + tpl[matchIndex + 2]);
                console.log('array is: ', matchAttributes);

                componentPath = 'basic/' + matchStr.replace(/\-/gi, '/');
                componentAttributes = [ ];
                for (var i = 0, l = matchAttributes.length; i < l; i++) {
                    matchAttribute = matchAttributes[i].split('=');
                }
            }

            container.innerHTML = tpl;

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
