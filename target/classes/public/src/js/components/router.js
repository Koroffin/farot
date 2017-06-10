F.define('managers/page', function (PageManager) {
    'use strict';
    function get_default_handler (name) {
        return function (data) {
            PageManager.serve(name, data);
        };
    }
    function navigateHistory (state) {
        history.pushState(null, null, state);
    }
    function navigateHash (state) {
        window.location.hash = state;
    }
    var _navigate = typeof history !== 'undefined' ? navigateHistory : navigateHash;

    function Router () {
        this.states = { };
        this.isStarted = false;
        this._overwise = F.nope;
    }
    Router.prototype.state = function (stateName, fn) {
        this.states[stateName] = F.isFunction(fn) ? fn : get_default_handler(stateName);
        if (this.isStarted) {
            this.checkState(stateName);
        }
        return this;
    };
    Router.prototype.overwise = function (fn) {
        this._overwise = fn;
        return this;
    };
    Router.prototype.start = function () {
        this.isStarted = true;
        this.currentState = window.location.hash.replace(/^#/, '');
        this.update();
        return this;
    };
    Router.prototype.checkState = function (stateName) {
        if (stateName === this.currentState) {
            this.states[stateName](this.data);
        }
    };
    Router.prototype.update = function () {
        var fn = this.states[this.currentState];
        if (F.isFunction(fn)) {
            fn(this.data);
        } else {
            this._overwise(this.data);
        }
    };
    Router.prototype.navigate = function (state, data) {
        if (state !== this.currentState) {
            _navigate(state);
            this.currentState = state;
            this.data = data;
            this.update();
        }
    };

    return new Router();
});
