F.define(
    'core/assign',
function () {
    'use strict';
    return {
        setState: function (obj) {
            this.state = F.assign(this.state, obj);
            // TODO: перерисовывать компонент
        }
    };
});
