F.define(
    'json!./operandPriority',
    './helpers',
    'core/assign',
function (operandPriority, helpers) {
    'use strict';

    function Word () {
        this.value = undefined;
        this.type = this.UNDEFINED_TYPE;
        this.readedSubstr = '';
    }
    Word.prototype = {
        UNDEFINED_TYPE: 'undefined',
        NUMBER_TYPE: 'number',
        VARIABLE_TYPE: 'variable',
        STRING_TYPE: 'string',
        FLOAT_TYPE: 'float',
        OPERAND_TYPE: 'operand',
        FUNCTION_TYPE: 'function',
        CONDITION_TYPE: 'condition',

        ERROR_STATUS: 'error',
        OK_STATUS: 'ok',
        END_STATUS: 'end',

        STRING_MATCH: '\'',
        STRING_MATCH_DOUBLE: '"',

        DOT: '.',
        COMMA: ',',

        PLUS: '+',
        MINUS: '-',
        PERCENT: '%',
        MULTIPLE: '*',
        DIVIDE: '/',
        BRACKET_OPEN: '(',
        BRACKET_CLOSE: ')',
        VERTICAL_LINE: '|',
        AND_SYMBOL: '&',
        EXCLAMATION_MARK: '!',
        MORE_SIGN: '>',
        LESS_SIGN: '<',
        EQUAL_SIGN: '=',
        COLON: ':',
        QUESTION_MARK: '?',

        predefinedVariables: {
            'true': true,
            'false': false,
            'undefined': undefined,
            'Infinity': Infinity
        },

        error: function (msg) {
            F.error(e);
            return this.ERROR_STATUS;
        },
        ok: function () {
            return this.OK_STATUS;
        },
        end: function () {
            return this.END_STATUS;
        },

        defineType: function (symbol) {
            var isChar = /[a-z]/i.test(symbol);
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

            if (this.isVariable() && this.isOpenBracketSymbol(symbol)) {
                // it's a function, not variable
                this
                    .setType(this.FUNCTION_TYPE)
                        .argumentsCount = 0;
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

            if (this.isVariable() || this.isFunction()) {
                if (F.isDefined(this.predefinedVariables[this.readedSubstr])) {
                    return this.predefinedVariables[this.readedSubstr];
                } else {
                    return parent[this.readedSubstr];
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
        },
        getOperand: function () {
            return this.readedSubstr;
        },
        getOperandPriority: function () {
            return F.isDefined(operandPriority[this.readedSubstr]) ? operandPriority[this.readedSubstr] : Infinity;
        },
        getOperandArgumentsLength: function () {
            if (F.isDefined(this.argumentsCount)) {
                return this.argumentsCount;
            }
            if (this.isLogicalNot()) {
                return 1;
            }
            if (this.isCondition()) {
                return 3;
            }
            return 2;
        },

        setType: function (type) {
            this.type = type;
            return this;
        },

        last: function () {
            return F.last(this.readedSubstr);
        },

        canAddNumber: function () {
            return this.isUndefined() || this.isNumber() || this.isString() || this.isFloat();
        },
        canAddChar: function () {
            return this.isUndefined() || this.isVariable() || this.isString();
        },

        isStringMatch: function (symbol) {
            return (symbol === this.STRING_MATCH) || (symbol === this.STRING_MATCH_DOUBLE);
        },
        isDotSymbol: function (symbol) {
            return symbol === this.DOT;
        },
        isCommaSymbol: function (symbol) {
            return symbol === this.COMMA;
        },
        isOpenBracketSymbol: function (symbol) {
            return symbol === this.BRACKET_OPEN;
        },
        isCloseBracketSymbol: function (symbol) {
            return symbol === this.BRACKET_CLOSE;
        },
        isOperandSymbol: function (symbol) {
            return (
                (symbol === this.PLUS) ||
                (symbol === this.MINUS) ||
                (symbol === this.DIVIDE) ||
                (symbol === this.MULTIPLE) ||
                (symbol === this.BRACKET_OPEN) ||
                (symbol === this.BRACKET_CLOSE) ||
                (symbol === this.PERCENT) ||
                (symbol === this.VERTICAL_LINE) ||
                (symbol === this.AND_SYMBOL) ||
                (symbol === this.EXCLAMATION_MARK) ||
                (symbol === this.MORE_SIGN) ||
                (symbol === this.LESS_SIGN) ||
                (symbol === this.EQUAL_SIGN) ||
                (symbol === this.COLON) ||
                (symbol === this.QUESTION_MARK)
            );
        },
        canAddToOperand: function (symbol) {
            return (
                // for logical "and"
                ((this.readedSubstr === this.AND_SYMBOL) && (symbol === this.AND_SYMBOL)) ||
                // for logical "or"
                ((this.readedSubstr === this.VERTICAL_LINE) && (symbol === this.VERTICAL_LINE)) ||
                // for "=="
                ((this.readedSubstr === this.EQUAL_SIGN) && (symbol === this.EQUAL_SIGN)) ||
                // for "==="
                ((this.readedSubstr === (this.EQUAL_SIGN + this.EQUAL_SIGN)) && (symbol === this.EQUAL_SIGN)) ||
                // for "<="
                ((this.readedSubstr === this.LESS_SIGN) && (symbol === this.EQUAL_SIGN)) ||
                // for ">="
                ((this.readedSubstr === this.MORE_SIGN) && (symbol === this.EQUAL_SIGN))
            );
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
        },

        isOpenBracket: function () {
            return this.readedSubstr === this.BRACKET_OPEN;
        },
        isCloseBracket: function () {
            return this.readedSubstr === this.BRACKET_CLOSE;
        },
        isPlus: function () {
            return this.readedSubstr === this.PLUS;
        },
        isMinus: function () {
            return this.readedSubstr === this.MINUS;
        },
        isMultiple: function () {
            return this.readedSubstr === this.MULTIPLE;
        },
        isDivide: function () {
            return this.readedSubstr === this.DIVIDE;
        },
        isMod: function () {
            return this.readedSubstr === this.PERCENT;
        },
        isLogicalAnd: function () {
            return this.readedSubstr === (this.AND_SYMBOL + this.AND_SYMBOL);
        },
        isLogicalOr: function () {
            return this.readedSubstr === (this.VERTICAL_LINE + this.VERTICAL_LINE);
        },
        isLogicalNot: function () {
            return this.readedSubstr === this.EXCLAMATION_MARK;
        },
        isComma: function () {
            return this.readedSubstr === this.COMMA;
        },
        isMore: function () {
            return this.readedSubstr === this.MORE_SIGN;
        },
        isMoreOrEqual: function () {
            return this.readedSubstr === (this.MORE_SIGN + this.EQUAL_SIGN);
        },
        isLess: function () {
            return this.readedSubstr === this.LESS_SIGN;
        },
        isLessOrEqual: function () {
            return this.readedSubstr === (this.LESS_SIGN + this.EQUAL_SIGN);
        },
        isEqual: function () {
            return this.readedSubstr === (this.EQUAL_SIGN + this.EQUAL_SIGN);
        },
        isStrictEqual: function () {
            return this.readedSubstr === (this.EQUAL_SIGN + this.EQUAL_SIGN + this.EQUAL_SIGN);
        },
        isColon: function () {
            return this.readedSubstr === this.COLON;
        },
        isQuestionMark: function () {
            return this.readedSubstr === this.QUESTION_MARK;
        },
        isDot: function () {
            return this.readedSubstr === this.DOT;
        }
    };

    return Word;
});