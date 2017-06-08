(function (scope) {
    'use strict';
    var modules = { };

    function getLoadPath (name, postfixes, context, folder) {
        // check for relative path
        if (name[0] === '.') {
            return '/src/' + context + '/' + name.substr(2) + postfixes.pop();
        } else {
            return '/src/' + folder + '/' + name + postfixes.pop();
        }
    }
    function loadJS (name, callback, postfixes, context) {
        var path = getLoadPath(name, postfixes, context, 'js');

        if (F.isDefined(modules[path])) {
            callback(modules[path]);
        } else {
            F.send(path).then(function (res) {
                var plain = res.responseText;

                // check if define module
                var define_match = /F\.define\(/.exec(plain);
                if (define_match && (define_match.index === 0)) {
                    // add current path as context
                    var last_char_match = /\)[^\)]+$/.exec(plain);
                    eval(plain.substr(0, last_char_match.index) + ', "js/' + name + '");').then(function (result) {
                        modules[path] = result;
                        callback(result);
                    });
                } else {
                    var s = document.createElement('script');
                    s.innerHTML = plain;
                    document.head.appendChild(s);
                    modules[path] = null;
                    callback(null);
                }
            }).catch(function () {
                if (F.isEmpty(postfixes)) {
                    F.error('Could not load file ' + name + ' in context ' + context);
                } else {
                    loadJS(name, callback, postfixes, context);
                }
            });
        }
    }
    function loadJson (name, callback, postfixes, context) {
        var path = getLoadPath(name, postfixes, context, 'json');
        F.send(path).then(function (res) {
            callback(JSON.parse(res.responseText));
        }).catch(function () {
            F.error('Could not load file ' + name + ' in context ' + context);
        });
    }
    function loadPlain (name, callback, postfixes, context) {
        var path = getLoadPath(name, postfixes, context, '');
        F.send(path).then(function (res) {
            callback(res.responseText);
        }).catch(function () {
            F.error('Could not load file ' + name + ' in context ' + context);
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
        } else {
            loadJS(name, callback, [ '/index.js', '.js' ], context);
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
            callback = args.pop();

        try {
            if (!F.isFunction(callback)) {
                throw new Error('Require callback should be a function');
            }

            for (var i=0, l=args.length; i<l; i++) {
                loaders.push(loadHandler(args[i], this));
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
                throw new Error('Define callback should be a function');
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
