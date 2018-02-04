(function (context) {
    'use strict';

    var operandPriority = {
        '(': 1,
        '==': 2,
        '===': 2,
        '>': 2,
        '>=': 2,
        '<=': 2,
        '<': 2,
        '+': 3,
        '-': 3,
        '*': 4,
        '/': 4,
        '%': 5,
        '||': 6,
        '&&': 7
    };
    
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

        predefinedVariables: {
            'true': true,
            'false': false,
            'undefined': undefined,
            'Infinity': Infinity
        },

        _addSymbol: function (symbol) {
            this.readedSubstr += symbol;
            return this;
        },
        addSymbol: function (symbol) {
            var res = this.OK_STATUS;

            try {
                var isChar = /[a-z]/i.test(symbol);
                var isNumber = /[0-9]/i.test(symbol);
                var isWhiteSpace = /\s/.test(symbol);

                if (this.isString()) {
                    if (this.isStringMatch(symbol) && (this.stringStartedSymbol === symbol)) {
                        res = this.END_STATUS;
                    } else {
                        this._addSymbol(symbol);
                    }                    
                } else if (this.isUndefined()) {
                    // need initialize type
                    if (isNumber) {
                        this.setType(this.NUMBER_TYPE)
                            ._addSymbol(symbol);
                    } else if (isChar) {
                        this.setType(this.VARIABLE_TYPE)
                            ._addSymbol(symbol);
                    } else if (this.isStringMatch(symbol)) {
                        this.setType(this.STRING_TYPE)
                            .stringStartedSymbol = symbol;
                    } else if (this.isDot(symbol)) {
                        this.setType(this.FLOAT_TYPE)
                            ._addSymbol('0')
                            ._addSymbol(symbol);
                    } else if (this.isOperandSymbol(symbol)) {
                        this.setType(this.OPERAND_TYPE)
                            ._addSymbol(symbol);
                    } else if (isWhiteSpace) {
                        // ignore it
                    } else if (this.isCommaSymbol(symbol)) {
                        this._addSymbol(symbol);
                        res = this.END_STATUS;
                    } else {
                        throw new Error('Can not start a word with ' + symbol);
                    }
                } else if (isWhiteSpace) {
                    res = this.END_STATUS;
                } else if (this.isVariable() && this.isOpenBracketSymbol(symbol)) {
                    // it's a function, not variable
                    this.setType(this.FUNCTION_TYPE);
                    this.argumentsCount = 0;
                    res = this.END_STATUS;
                } else if (this.isVariable() && this.isCommaSymbol(symbol)) {
                    res = this.END_STATUS;
                } else if (isChar && this.canAddChar()) {  
                    this._addSymbol(symbol);
                } else if (isNumber && this.canAddNumber()) {
                    this._addSymbol(symbol);
                } else if (this.isDot(symbol) && this.isNumber()) {
                    // it's a float, not number
                    this.setType(this.FLOAT_TYPE)
                        ._addSymbol(symbol);
                } else if (this.isOperandSymbol(symbol)) {
                    if (this.isOperand() && this.canAddToOperand(symbol)) {
                        this._addSymbol(symbol);
                    } else {
                        res = this.END_STATUS;
                    }                    
                } else if (this.isOperand()) {
                    res = this.END_STATUS;
                } else {
                    throw new Error('Can not add symbol ' + symbol + ' to word ' + this.readedSubstr);
                }
            } catch (e) {
                F.error(e);
                res = this.ERROR_STATUS;
            }
                
            return res;
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
            if (this.isVariable()) {
                if (F.isDefined(this.predefinedVariables[this.readedSubstr])) {
                    return this.predefinedVariables[this.readedSubstr];
                } else {
                    return parent[this.readedSubstr];
                }                
            }
            if (this.isFloat()) {
                return parseFloat(this.readedSubstr, 10);
            }
            if (this.isPlus()) {
                return function (a, b) {
                    return b + a;
                };
            }
            if (this.isMinus()) {
                return function (a, b) {
                    return b - a;
                };
            }
            if (this.isDivide()) {
                return function (a, b) {
                    return b / a;
                };
            }
            if (this.isMultiple()) {
                return function (a, b) {
                    return b * a;
                };
            }
            if (this.isMod()) {
                return function (a, b) {
                    return b % a;
                };
            }
            if (this.isLogicalNot()) {
                return function (a) {
                    return !a;
                };
            }
            if (this.isLogicalAnd()) {
                return function (a, b) {
                    return b && a;
                };
            }
            if (this.isLogicalOr()) {
                return function (a, b) {
                    return b || a;
                };
            }
            if (this.isEqual()) {
                return function (a, b) {
                    return b == a;
                };
            }
            if (this.isStrictEqual()) {
                return function (a, b) {
                    return b === a;
                };
            }
            if (this.isMore()) {
                return function (a, b) {
                    return b > a;
                };
            }
            if (this.isMoreOrEqual()) {
                return function (a, b) {
                    return b >= a;
                };
            }
            if (this.isLess()) {
                return function (a, b) {
                    return b < a;
                };
            }
            if (this.isLessOrEqual()) {
                return function (a, b) {
                    return b <= a;
                };
            }
            if (this.isFunction()) {
                return parent[this.readedSubstr];
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
        isDot: function (symbol) {
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
                (symbol === this.EQUAL_SIGN)
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
        }
    };

    function _evalStack (stack, parent) {
        var res, value, element,
            argumentsArray, argumentsCount;
        res = [ ];
        for (var i = 0, l = stack.length; i < l; i++) {
            element = stack[i];
            value = element.getValue(parent);
            if (element.isOperand() || element.isFunction()) {
                argumentsCount = element.getOperandArgumentsLength();
                argumentsArray = [ ];
                for (var j = 0; j < argumentsCount; j++) {
                    argumentsArray.push(res.pop());
                }
                value = value.apply(this, argumentsArray);
            }
            res.push(value);
        }
        return res[0];
    }
    function _eval (str, parent) {
        var words, pointer, currentWord, res, 
            outputArray, operandsStack, operand, poppedOperand,
            currentFunction;

        words = [ ];
        pointer = 0;
        currentWord = new Word();

        outputArray = [ ];
        operandsStack = [ ];

        while (F.isDefined(str[pointer])) {
            res = currentWord.addSymbol(str[pointer]);

            if (res === Word.prototype.ERROR_STATUS) {
                break;
            }
            if (res === Word.prototype.END_STATUS) {
                if (currentWord.isString() || currentWord.isComma()) {
                    // need to increase pointer
                    pointer++
                } 
                if (currentWord.isOperand()) {
                    // parse as operand
                    if (currentWord.isCloseBracket()) {
                        // pop untill '('
                        operand = operandsStack.pop();
                        while (!operand.isOpenBracket()) {
                            outputArray.push(operand);
                            operand = operandsStack.pop();
                        }
                    } else if (currentWord.isOpenBracket()) {
                        operandsStack.push(currentWord);
                    } else {
                        // pop untill priority will be lower
                        while (!F.isEmpty(operandsStack) && F.last(operandsStack).getOperandPriority() >= currentWord.getOperandPriority()) {
                            poppedOperand = operandsStack.pop();
                            if (poppedOperand.isFunction()) {
                                currentFunction = currentFunction.previousFunction;
                            }
                            outputArray.push(poppedOperand);
                        }
                        operandsStack.push(currentWord);
                    }
                } else if (currentWord.isFunction()) {
                    operandsStack.push(currentWord);
                    if (F.isDefined(currentFunction)) {
                        currentFunction.function.argumentsCount++;
                    }
                    currentFunction = {
                        function: currentWord,
                        previousFunction: currentFunction
                    };
                } else {
                    if (F.isDefined(currentFunction)) {
                        currentFunction.function.argumentsCount++;
                    }
                    outputArray.push(currentWord);
                }
                currentWord = new Word();
            } else {
                pointer++;
            }            
        }

        if (currentWord.isOperand()) {
            // parse as operand
            if (currentWord.isCloseBracket()) {
                // pop untill '('
                operand = operandsStack.pop();
                while (!operand.isOpenBracket()) {
                    outputArray.push(operand);
                    operand = operandsStack.pop();
                }
            } else if (currentWord.isOpenBracket()) {
                operandsStack.push(currentWord);
            } else {
                // pop untill priority will be lower
                while (!F.isEmpty(operandsStack) && F.last(operandsStack).getOperandPriority() >= currentWord.getOperandPriority()) {
                    outputArray.push(operandsStack.pop());
                }
                operandsStack.push(currentWord);
            }
        } else if (!currentWord.isUndefined()) {
            outputArray.push(currentWord);
        }        

        // add all operands to output
        while (operand = operandsStack.pop()) {
            outputArray.push(operand);
        }

        F.debug('here is output: ', outputArray)

        return _evalStack(outputArray, parent);
    }

    context.eval = _eval;

})(F);