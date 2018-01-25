F.define(
    'basic/abstract',
    'handlers/input',
    'plain!./templates/index.html',
    'core/trigger',
function (AbstractBasic, InputHandler, tpl) {
    'use strict';
    var InputBasic;

    InputBasic = function (options) {
        options.tpl = tpl;
        options.handlers = [
            InputHandler
        ];
        options.className = options.className ? (options.className + ' f-input') : 'f-input';
        return new AbstractBasic(options);
    };

    return InputBasic;
});