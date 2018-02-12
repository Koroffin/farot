F.define(
    'classes/component/component',
    'handlers/input',
    'plain!./templates/index.html',
    'core/trigger',
function (Component, InputHandler, tpl) {
    'use strict';
    var InputBasic;

    InputBasic = function (options) {
        options.tpl = tpl;
        options.handlers = [
            InputHandler
        ];
        options.className = options.className ? (options.className + ' f-input') : 'f-input';
        return new Component(options);
    };

    return InputBasic;
});