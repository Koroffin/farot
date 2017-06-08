F.define(
    'core/events',
    'core/class',
    'core/trigger',
    'core/attr',
    'core/val',
    'core/immediate',
function () {
    'use strict';

    // private helpers
    var origin = window.location.origin;
    function _cutAction (action) {
        return action.replace(new RegExp('^' + origin + '/', 'g'), '');
    }
    // function _validateRequire (e) {
    //     var el = e.target;
    //     F.immediate(function () {
    //         var val = F.val(el);
    //         if (F.isEmpty(val)) {
    //             F.addClass(el, 'f-error');
    //         } else {
    //             F.removeClass(el, 'f-error');
    //         }
    //     });
    // }
    function _getFormData (form) {
        var elements = form.elements,
            data = { },
            element;

        for (var i=0, l=elements.length; i<l; i++) {
            element = elements[i];
            if (!F.isEmpty(element.name)) {
                data[element.name] = element.value;
            }
        }

        return data;
    }
    function _onFormSubmit (e) {
        var form = e.target,
            name = form.name,
            data = _getFormData(form),
            action = _cutAction(form.action);

        if (!F.isEmpty(action)) {
            F.trigger('submit:' + name, { target: form });

            F.api(action, data).then(function (res) {
                F.trigger('submit:' + name + ':success', { target: form, data: res });
            }).catch(function (err) {
                F.trigger('submit:' + name + ':error', { target: form, data: err });
            });
        }

        F.stopEvent(e);
    }
    function _processForm (form) {
        var elements = form.elements,
            handlers = [ F.addEvent(form, 'submit', _onFormSubmit) ],
            element;

        for (var i=0, l=elements.length; i<l; i++) {
            element = elements[i];

            // check for require
            // if (!F.isEmpty(F.getAttr(element, 'required'))) {

            // }
        }

        return {
            handlers: handlers
        };
    }

    function Form (el) {
        var forms = el.getElementsByTagName('form');
        this.handled = [ ];
        for (var i=0, l=forms.length; i<l; i++) {
            this.handled.push(_processForm(forms[i]));
        }
    }
    function destroy () {
        var handlers;
        for (var i=0, l=this.handled.length; i<l; i++) {
            handlers = this.handled[i].handlers;
            for (var j=0, _l=handlers.length; j<_l; j++) {
                F.removeEvent(handlers[j]);
            }
        }
    }

    Form.prototype.destroy = destroy;

    return Form;
});
