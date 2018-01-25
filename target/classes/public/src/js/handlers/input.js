F.define(
    'helpers/input.any.change',
    'core/events',
    'core/class',
    'core/trigger',
    'core/attr',
    'core/val',
    'core/immediate',
function (InputAnyChange) {
    'use strict';

    // private helpers
    function _setError (el) {
        F.addClass(el, 'f-error');
    }
    function _removeError (el) {
        F.removeClass(el, 'f-error');
    }
    function _validateRequire (e) {
        var el = e.target;
        F.addClass(el, 'f-touched');
        F.immediate(function () {
            if (F.isEmpty(F.val(el))) {
                _setError(el);
            } else {
                _removeError(el);
            }
        });
    }
    function _processInput (input) {
        var result = [ ];

        

        return result;
    }

    function Input (el) {
        this.handled =  _processInput(el);
    }

    Input.prototype = {
        destroy: function () {
            var handler;
            for (var i  =0, l = this.handled.length; i < l; i++) {
                handler = this.handled[i];
                F.removeEvent(handler);
            }
        }
    };

    return Input;
});
