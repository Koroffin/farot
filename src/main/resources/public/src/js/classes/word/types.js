F.define(
	'json!./types',
	'core/assign',
function (types) {
	'use strict';

	return F.assign({
        isString: function () {
            return this.type === this.STRING_TYPE;
        },
        isUndefined: function () {
            return this.type === this.UNDEFINED_TYPE;
        },
        isNumber: function () {
            return this.type === this.NUMBER_TYPE;
        },
        isVariable: function () {
            return this.type === this.VARIABLE_TYPE;
        },
        isFloat: function () {
            return this.type === this.FLOAT_TYPE;
        },
        isOperand: function () {
            return this.type === this.OPERAND_TYPE;
        },
        isFunction: function () {
            return this.type === this.FUNCTION_TYPE;
        },
        isCondition: function () {
            return this.type === this.CONDITION_TYPE;
        }
	}, types);
});