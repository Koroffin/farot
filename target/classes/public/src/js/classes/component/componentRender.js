F.define(
    'core/trim',
    'core/eval',
function () {
    'use strict';

    return {
        _requireComponent: function(container, componentPath, componentAttributes, matchIndex, isSingle) {
            return function (callback) {
                F.require(componentPath + '/index', function (Component) {
                    var component = new Component({ props: componentAttributes }).render();
                    var filler = container.getElementsByClassName('f-component-' + matchIndex)[0];

                    if (!isSingle) {
                        component.element.innerHTML = filler.innerHTML;
                    }

                    filler.parentNode.replaceChild(component.element, filler);
                    
                    callback(null);
                });
            }
        },
        renderComponents: function (callback) {
            var container, tpl, generatedTpl,
                re, match, matchStr, matchIndex, matchAttributes, matchAttribute, matchSingle,
                componentPath, componentAttributes, componentAttributeValue,
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

                componentPath = 'basic/' + matchAttributes[0].replace(/\-/gi, '/');
                componentAttributes = [ ];
                for (var i = 1, l = matchAttributes.length; i < l; i++) {
                    matchAttribute = matchAttributes[i].split('=');
                    componentAttributeValue = F.trim(matchAttribute[1]);

                    if (componentAttributeValue[0] === '"') {
                        // just a string
                        componentAttributeValue = componentAttributeValue.slice(1, -1);
                    } else if (componentAttributeValue[0] === '{') {
                        // state variable, need eval
                        componentAttributeValue = F.eval(componentAttributeValue.slice(1, -1), this.options);
                    }

                    componentAttributes.push(
                        {
                            name: F.trim(matchAttribute[0]),
                            value: componentAttributeValue
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
        }
    };
});
