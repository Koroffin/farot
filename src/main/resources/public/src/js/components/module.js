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
        _requireComponent: function() {

        },
        render: function () {
            var container, tpl, generatedTpl,
                re, match, matchStr, matchIndex, matchAttributes, matchAttribute, matchSingle,
                componentsHash, componentPath, componentAttributes, componentAttribute;

            container = document.createElement('div');
            tpl = this.options.tpl;
            componentsHash = { };

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

                console.log('match custom component: ', matchStr, matchIndex);
                console.log('test index: ', tpl[matchIndex] + tpl[matchIndex + 1] + tpl[matchIndex + 2]);
                console.log('array is: ', matchAttributes);

                componentPath = 'basic/' + matchAttributes[0].replace(/\-/gi, '/');
                componentAttributes = [ ];
                for (var i = 1, l = matchAttributes.length; i < l; i++) {
                    matchAttribute = matchAttributes[i].split('=');
                    componentAttributes.push(
                        {
                            name: F.trim(matchAttribute[0]),
                            value: matchAttribute[1] ? F.trim(matchAttribute[1]) : ''
                        }
                    );
                }

                console.log('component path: ', componentPath);
                console.log('component attributes: ', componentAttributes);

                if (F.isDefined(componentsHash[componentPath])) {
                    componentsHash[componentPath].elements.push(
                        {
                            componentIndex: matchIndex,
                            componentAttributes: componentAttributes
                        }
                    );
                } else {
                    componentsHash[componentPath] = {
                        elements: [
                            {
                                componentIndex: matchIndex,
                                componentAttributes: componentAttributes
                            }
                        ]
                    };
                }

                generatedTpl = 
                    generatedTpl.substr(0, matchIndex) + 
                        '<div id="f-component-' + matchIndex + '">' + 
                        (matchSingle ? '</div>' : '') +
                    generatedTpl.substr(matchIndex + match[0].length);
            }

            generatedTpl = generatedTpl.replace(/<\/\s*f-([^>]+)\s*>/gi, '</div>');

            console.log('components hash: ', componentsHash);

            container.innerHTML = generatedTpl;

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
