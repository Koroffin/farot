F.define(function () {
    'use strict';

    function isState (value) {
        return (this.readedSubstr === this.STATE) || this.state;
    }
    function setAsState () {
        this.state = true;
    }

    return {
        STATE: '$state',
        isState: isState,
        setAsState: setAsState
    };
});