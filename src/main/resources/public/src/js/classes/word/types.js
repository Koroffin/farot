F.define(
    'json!./types',
    'core/assign',
function (types) {
    'use strict';

    return F.assign({
        setType: function (type) {
            this.type = type;
            return this;
        },
        defineType: function (symbol) {
            var isChar = /[a-z$_]/i.test(symbol);
            var isNumber = /[0-9]/i.test(symbol);
            var isWhiteSpace = /\s/.test(symbol);

            if (isNumber) {
                return this.setType(this.NUMBER_TYPE)
                    ._addSymbol(symbol)
                    .ok();
            } else if (isChar) {
                return this
                    .setType(this.VARIABLE_TYPE)
                    ._addSymbol(symbol)
                    .ok();
            } else if (this.isStringMatch(symbol)) {
                this
                    .setType(this.STRING_TYPE)
                        .stringStartedSymbol = symbol;
                return this.ok();
            } else if (this.isOpenBracketSymbol(symbol) && F.isDefined(this.previousWord) && !this.previousWord.isOperand() && !this.previousWord.isFunction()) {
                this
                    .setType(this.FUNCTION_TYPE)
                        .argumentsCount = 0;
                this.readedSubstr = this.previousWord.readedSubstr;
                return this.end();
            } else if (this.isOperandSymbol(symbol)) {
                return this
                    .setType(this.OPERAND_TYPE)
                    ._addSymbol(symbol)
                    .ok();
            } else if (isWhiteSpace) {
                // ignore it
                return this.ok();
            } else if (this.isCommaSymbol(symbol)) {
                return this
                    ._addSymbol(symbol)
                    .end();
            } else if (this.isDotSymbol(symbol)) {
                return this
                    .setType(this.OPERAND_TYPE)
                    ._addSymbol(symbol)
                    .end();
            } else {
                return this.error('Can not start a word with ' + symbol);
            }            
        },
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