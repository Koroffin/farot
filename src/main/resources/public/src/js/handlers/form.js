F.define(
    'helpers/input.any.change',
    'core/events',
    'core/class',
    'core/trigger',
    'core/attr',
    'core/val',
    'core/immediate',
    'core/parent',
function (InputAnyChange) {
    'use strict';

    // private helpers
    var origin = window.location.origin;
    function _cutAction (action) {
        return action.replace(new RegExp('^' + origin + '/', 'g'), '');
    }
    function _validateForm (form) {
        var elements = form.elements;
        for (var i=0, l=elements.length; i<l; i++) {
            if (F.hasClass(elements[i], 'f-error')) {
                F.addClass(form, 'f-error');
                return false;
            }
        }
        F.removeClass(form, 'f-error');
        return true;
    }
    function _setError (el) {
        F.addClass(el, 'f-error');
        _validateForm(F.parent(el, 'form'));
    }
    function _removeError (el) {
        F.removeClass(el, 'f-error');
        _validateForm(F.parent(el, 'form'));
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
    function _getFormData (form) {
        var elements = form.elements,
            data = { },
            element;

        for (var i=0, l=elements.length; i<l; i++) {
            element = elements[i];
            if (!F.isEmpty(element.name)) {
                data[element.name] = F.val(element);
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
            objects = [ ],
            element;

        for (var i=0, l=elements.length; i<l; i++) {
            element = elements[i];

            // check for require
            if (F.isDefined(F.getAttr(element, 'required'))) {
                objects.push(new InputAnyChange(element, _validateRequire, true));
            }

            _validateForm(form);
        }

        return {
            handlers: handlers,
            objects: objects
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
        var handlers, objects;
        for (var i=0, l=this.handled.length; i<l; i++) {
            handlers = this.handled[i].handlers;
            objects = this.handled[i].objects;

            for (var j=0, _l=handlers.length; j<_l; j++) {
                F.removeEvent(handlers[j]);
            }

            for (var k=0, __l=objects.length; k<__l; k++) {
                objects[k].destroy();
            }
        }
    }

    Form.prototype.destroy = destroy;

    return Form;
});
