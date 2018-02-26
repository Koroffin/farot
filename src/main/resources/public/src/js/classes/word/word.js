F.define(
    './operand',
    './types',
    './statuses',
    './symbols',
    './helpers',
    './state',
    'core/assign',
function (operand, types, statuses, symbols, helpers, state) {
    'use strict';

    function Word (previousWord) {
        this.value = undefined;
        this.type = this.UNDEFINED_TYPE;
        this.readedSubstr = '';
        this.previousWord = previousWord;
    }
    Word.prototype = F.assign({
        predefinedVariables: {
            'true': true,
            'false': false,
            'undefined': undefined,
            'Infinity': Infinity,
            'F': F
        },

        _addSymbol: function (symbol) {
            this.readedSubstr += symbol;
            return this;
        },
        addSymbol: function (symbol) {
            var isChar = /[a-z]/i.test(symbol);
            var isNumber = /[0-9]/i.test(symbol);
            var isWhiteSpace = /\s/.test(symbol);

            if (this.isString()) {
                if (this.isStringMatch(symbol) && (this.stringStartedSymbol === symbol)) {
                    return this.end();
                } else {
                    return this
                        ._addSymbol(symbol)
                        .ok();
                }                    
            }

            if (this.isUndefined()) {
                // need initialize type
                return this.defineType(symbol);
            }

            if (isWhiteSpace) {
                return this.end();
            }

            if (this.isCommaSymbol(symbol)) {
                return this.end();
            }

            if ((isChar && this.canAddChar()) || (isNumber && this.canAddNumber())) {  
                return this
                    ._addSymbol(symbol)
                    .ok();
            }

            if (this.isDotSymbol(symbol)) {
                if (this.isNumber()) {
                    // it's a float, not number
                    return this.setType(this.FLOAT_TYPE)
                        ._addSymbol(symbol)
                        .ok();
                } else if (this.isString() || this.isVariable()) {
                    return this.end();
                }
            }

            if (this.isOperandSymbol(symbol)) {
                if (this.isOperand() && this.canAddToOperand(symbol)) {
                    return this
                        ._addSymbol(symbol)
                        .ok();
                } else {
                    return this.end();
                }                    
            }

            if (this.isOperand()) {
                return this.end();
            }
                
            return this.error('Can not add symbol ' + symbol + ' to word ' + this.readedSubstr);
        },

        getValue: function (parent) {
            if (this.isUndefined()) {
                return undefined;
            }
            if (this.isString()) {
                return this.readedSubstr;
            }

            if (this.isNumber()) {
                return parseInt(this.readedSubstr, 10);
            }
            if (this.isFloat()) {
                return parseFloat(this.readedSubstr, 10);
            }

            if (this.isVariable()) {
                if (F.isDefined(this.predefinedVariables[this.readedSubstr])) {
                    return this.predefinedVariables[this.readedSubstr];
                } else {
                    var result = parent[this.readedSubstr];
                    if (F.isFunction(result)) {
                        return {
                            _caller: result, 
                            context: parent
                        };
                    } else {
                        return result;
                    }
                }                
            }

            if (this.isPlus()) {
                return helpers.plus;
            }
            if (this.isMinus()) {
                return helpers.minus;
            }
            if (this.isDivide()) {
                return helpers.divide;
            }
            if (this.isMultiple()) {
                return helpers.multi;
            }
            if (this.isMod()) {
                return helpers.mod;
            }
            if (this.isLogicalNot()) {
                return helpers.logicalNot;
            }
            if (this.isLogicalAnd()) {
                return helpers.logicalAnd;
            }
            if (this.isLogicalOr()) {
                return helpers.logicalOr;
            }
            if (this.isEqual()) {
                return helpers.equal;
            }
            if (this.isStrictEqual()) {
                return helpers.strictEqual;
            }
            if (this.isMore()) {
                return helpers.more;
            }
            if (this.isMoreOrEqual()) {
                return helpers.moreOrEqual;
            }
            if (this.isLess()) {
                return helpers.less;
            }
            if (this.isLessOrEqual()) {
                return helpers.lessOrEqual;
            }
            if (this.isCondition()) {
                return helpers.condition;
            }
            if (this.isDot()) {
                return helpers.dot;
            }
            if (this.isFunction()) {
                return helpers.fn;
            }
        },

        last: function () {
            return F.last(this.readedSubstr);
        },

        canAddNumber: function () {
            return this.isUndefined() || this.isNumber() || this.isString() || this.isFloat();
        },
        canAddChar: function () {
            return this.isUndefined() || this.isVariable() || this.isString();
        }
    }, types, statuses, symbols, operand, state);

    return Word;
});