(function (scope) {
    'use strict';
    var modules = { },
        loaders = { },
        loaded  = { };

    // Загрузчик css (таск 3512338694)
    var sheet = (function() {
        // Create the <style> tag
        var style = document.createElement("style");

        // Add a media (and/or media query) here if you'd like!
        // style.setAttribute("media", "screen")
        // style.setAttribute("media", "only screen and (max-width : 1024px)")

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
    })();
    var addCssRule;
    if (F.isFunction(sheet.insertRule)) {
        addCssRule = function (selector, rules, index) {
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
    } else if (F.isFunction(sheet.addRule)) {
        addCssRule = function (selector, rules, index) {
            sheet.addRule(selector, rules, index);
        }
    } else {
        addCssRule = function () {
            // TODO: рисовать заглушку "неподдерживаемый браузер"
        }
    }
    function loadCss (name, callback, postfixes, context) {
        var path, loader;
        path = getLoadPath(name, postfixes, context, 'css');

        if (F.isDefined(loaded[path])) {
            return callback(null);
        }

        if (F.isDefined(loaders[path])) {
            loader = loaders[path];
        } else {
            loader = loaders[path] = F.send(path).then(function (res) {
                var cssText = res.responseText;
                var cssRules = cssText.split('}');
                var cssRule;
                for (var i = 0, l = cssRules.length; i < l; i++) {
                    cssRule = cssRules[i].split('{');
                    if (F.isDefined(cssRule[0]) && F.isDefined(cssRule[1])) {
                        addCssRule(cssRule[0], cssRule[1]);
                    }
                }
                loaded[path] = true;
            }).catch(function () {
                F.error('Could not load file ' + name + ' in context ' + context);
            });
        }

        loader.then(function () {
            callback(null);
        });
    }

    function getLoadPath (name, postfixes, context, folder) {
        // check for relative path
        if (name[0] === '.') {
            var contextArr = context.split('/');
            context = contextArr.slice(0, -1).join('/');
            return '/src/' + context + '/' + name.substr(2) + postfixes.pop();
        } else {
            return '/src/' + folder + '/' + name + postfixes.pop();
        }
    }
    function getContextPath (name, context, folder) {
        // check for relative path
        if (name[0] === '.') {
            var contextArr = context.split('/');
            context = contextArr.slice(0, -1).join('/');
            return context + '/' + name.substr(2);
        } else {
            return folder + '/' + name;
        }
    }
    function loadJS (name, callback, postfixes, context) {
        var path, loader;
        path = getLoadPath(name, postfixes, context, 'js');

        if (F.isDefined(modules[path])) {
            return callback(modules[path]);
        } 
        
        if (F.isDefined(loaders[path])) {
            loader = loaders[path];
        } else {
            loader = loaders[path] = F.send(path).chain(function (res, next) {
                var plain = res.responseText;

                // check if define module
                var define_match = /F\.define\(/.exec(plain);
                if (define_match && (define_match.index === 0)) {
                    // add current path as context
                    var last_char_match = /\)[^\)]+$/.exec(plain);
                    eval(plain.substr(0, last_char_match.index) + ', "' + getContextPath(name, context, 'js') + '");').then(function (result) {
                        modules[path] = result;
                        next(result);
                    });
                } else {
                    var s = document.createElement('script');
                    s.innerHTML = plain;
                    document.head.appendChild(s);
                    modules[path] = null;
                    next(null);
                }
            }).catch(function () {
                F.error('Could not load file ' + name + ' in context ' + context);
            });
        }
        loader.chain(function (result, next) {
            callback(result);
            next(result);
        });
    }
    function loadJson (name, callback, postfixes, context) {
        var path, loader;
        path = getLoadPath(name, postfixes, context, 'json');

        if (F.isDefined(loaded[path])) {
            return callback(loaded[path]);
        }

        if (F.isDefined(loaders[path])) {
            loader = loaders[path];
        } else {
            loader = loaders[path] = F.send(path).then(function (res) {
                loaded[path] = JSON.parse(res.responseText);
            }).catch(function () {
                F.error('Could not load file ' + name + ' in context ' + context);
            });
        }

        loader.then(function (res) {
            callback(loaded[path]);
        });
    }
    function loadPlain (name, callback, postfixes, context) {
        var path, loader
        path = getLoadPath(name, postfixes, context, '');

        if (F.isDefined(loaded[path])) {
            return callback(loaded[path]);
        }

        if (F.isDefined(loaders[path])) {
            loader = loaders[path];
        } else {
            loader = loaders[path] = F.send(path).then(function (res) {
                loaded[path] = res.responseText;
            }).catch(function () {
                F.error('Could not load file ' + name + ' in context ' + context);
            });
        }

        loader.then(function (res) {
            callback(loaded[path]);
        });
    }

    function load (name, callback, context) {
        context = F.isString(context) ? context : '';
        var arr    = name.split('!'),
            loader = arr[0];
        if (loader === 'json') {
            loadJson(arr[1], callback, [ '.json' ], context);
        } else if (loader === 'plain') {
            loadPlain(arr[1], callback, [ '' ], context);
        } else if (loader === 'css') {
            loadCss(arr[1], callback, [ '.css' ], context)
        } else {
            loadJS(name, callback, [ '.js' ], context);
        }
    }
    function loadHandler (name, context) {
        return function (callback) {
            load(name, callback, context);
        };
    }

    function _require () {
        var loaders = [ ],
            args = F.cloneArray(arguments),
            callback = args.pop(),
            context = this;

        try {
            if (!F.isFunction(callback)) {
                throw new Error('Require callback should be a function');
            }

            for (var i = 0, l = args.length; i < l; i++) {
                loaders.push(loadHandler(args[i], context));
            }

            F.async(loaders).promise.then(function (files) {
                callback.apply(this, files);
            });
        } catch (e) {
            F.error(e);
        }
    }
    function _define () {
        var args = F.cloneArray(arguments),
            context = args.pop(),
            callback = args.pop(),
            promise = F.promise();

        try {
            if (!F.isFunction(callback)) {
                throw new Error('Define callback should be a function, but got ' + callback);
            }

            args.push(function () {
                promise.execute(callback.apply(this, arguments));
            });

            _require.apply(context, args);
        } catch (e) {
            F.error(e);
        }

        return promise;
    }

    scope.require = _require;
    scope.define  = _define;

})(F);
