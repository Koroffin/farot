F.define(function () {
    'use strict';

    function isState (value) {
        return this.readedSubstr === this.STATE || this.isState;
    }
    function setAsState () {
        this.isState = true;
    }

    return {
        STATE: '$state',
        isState: isState,
        setAsState: setAsState
    };
});