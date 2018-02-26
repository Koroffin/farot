F.define(
    'json!./statuses',
    'core/assign',
function (statuses) {
    'use strict';

    return F.assign({
        error: function (msg) {
            F.error(msg);
            return this.ERROR_STATUS;
        },
        ok: function () {
            return this.OK_STATUS;
        },
        end: function () {
            return this.END_STATUS;
        }
    }, statuses);
});