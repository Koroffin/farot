F.define('core/events', 'core/trigger', function () {
	function Form (el) {
		var forms = el.getElementsByTagName('form');
		this.handled = [ ];
		for (var i=0, l=forms.length; i<l; i++) {
			this.handled.push(_processForm(forms[i]));
		}
	}
	function destroy () {
		var handled;
		for (var i=0, l=this.handled.length; i<l; i++) {
			handled = this.handled[i];

			F.removeEvent(handled.submit_handler);

		}
	}

	// private helpers
	function _processForm (form) {
		var elements = form.elements,
			submit_handler;

		submit_handler = F.addEvent(form, 'submit', _onFormSubmit);

		return {
			submit_handler: submit_handler
		}
	}
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
		
		console.log('action: ', action);

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
	var origin = window.location.origin;
	function _cutAction (action) {
		return action.replace(new RegExp("^" + origin + "/", "g"), "");
	}

	Form.prototype.destroy = destroy;

	return Form;
});