F.define(
    'handlers/form',
    'handlers/a',
    'core/trim',
function (FormHandler, AHandler) {
    'use strict';
    var previousModule;

    function Module (options) {
        this.options = options;
        return this;
    }
    Module.prototype = {
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

                F.root.appendChild(me.el);

                if (F.isFunction(me.options.afterStart)) {
                    me.options.afterStart(me, data, callback);
                } else {
                    callback();
                }
            });
        },
        _requireComponent: function(container, componentPath, componentAttributes, matchIndex, isSingle) {
            return function (callback) {
                F.require(componentPath + '/index', function (Component) {
                    F.debug('Component: ', Component);
                    var component = new Component({ props: componentAttributes }).render();
                    var filler = container.getElementsByClassName('f-component-' + matchIndex)[0];

                    if (!isSingle) {
                        component.element.innerHTML = filler.innerHTML;
                    }

                    container.replaceChild(component.element, filler);
                    
                    callback(null);
                });
            }
        },
        render: function (callback) {
            var container, tpl, generatedTpl,
                re, match, matchStr, matchIndex, matchAttributes, matchAttribute, matchSingle,
                componentPath, componentAttributes, componentAttribute,
                asyncHandles = [ ];

            container = document.createElement('div');
            tpl = this.options.tpl;

            // Проверяем на компоненты
            re = /<f-([^>]+)\s*>/gi;
            generatedTpl = F.clone(tpl);
            while ((match = re.exec(generatedTpl)) !== null) {
                matchIndex = match.index;
                matchStr = F.trim(match[1].replace(/(\s{2,})|\n|\t/gi, ' '));
                matchSingle = F.last(matchStr) === '/';

                if (matchSingle) {
                    matchStr = F.trim(matchStr.slice(0, -1));
                }

                matchAttributes = matchStr.split(' ');

                F.debug('match custom component: ', matchStr, matchIndex);
                F.debug('test index: ', tpl[matchIndex] + tpl[matchIndex + 1] + tpl[matchIndex + 2]);
                F.debug('array is: ', matchAttributes);

                componentPath = 'basic/' + matchAttributes[0].replace(/\-/gi, '/');
                componentAttributes = [ ];
                for (var i = 1, l = matchAttributes.length; i < l; i++) {
                    matchAttribute = matchAttributes[i].split('=');
                    componentAttributes.push(
                        {
                            name: F.trim(matchAttribute[0]),
                            value: F.trim(matchAttribute[1])
                        }
                    );
                }

                F.debug('component path: ', componentPath);
                F.debug('component attributes: ', componentAttributes);

                asyncHandles.push(this._requireComponent(container, componentPath, componentAttributes, matchIndex, matchSingle));

                generatedTpl = 
                    generatedTpl.substr(0, matchIndex) + 
                        '<div class="f-component-' + matchIndex + '">' + 
                        (matchSingle ? '</div>' : '') +
                    generatedTpl.substr(matchIndex + match[0].length);
            }

            generatedTpl = generatedTpl.replace(/<\/\s*f-([^>]+)\s*>/gi, '</div>');

            container.innerHTML = generatedTpl;

            if (asyncHandles.length === 0) {
                callback(container);
            } else {
                F.async(asyncHandles).promise.then(function () {
                    callback(container);
                });
            }
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
