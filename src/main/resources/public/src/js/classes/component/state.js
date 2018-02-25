F.define(
    'core/assign',
function () {
    'use strict';
    return {
        setState: function (obj) {
            this.state = F.assign(this.state, obj);
            // TODO: перерисовывать компонент
        },
        initState: function () {
        	var state = { };

        	if (F.isDefined(this.options.initialState)) {
        		if (F.isFunction(this.options.initialState)) {
        			state = this.options.initialState();
        		} else {
        			state = this.options.initialState;
        		}
        	}

        	this.state = state;
        }
    };
});
