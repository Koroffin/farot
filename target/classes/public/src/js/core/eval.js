(function (context) {
    'use strict';

    var operandPriority = {
        '(': 1,
        '+': 2,
        '-': 2,
        '*': 3,
        '/': 3,
        '%': 4,
        '||': 5,
        '&&': 6
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

        ERROR_STATUS: 'error',
        OK_STATUS: 'ok',
        END_STATUS: 'end',

        STRING_MATCH: '\'',
        STRING_MATCH_DOUBLE: '"',

        DOT: '.',

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

                // Checking other symbols
                if (this.isString()) {
                    if (this.isStringMatch(symbol) && (this.stringStartedSymbol === symbol)) {
                        res = this.END_STATUS;
                    } else {
                        this._addSymbol(symbol);
                    }                    
                } else if (isWhiteSpace) {
                    if (this.isUndefined()) {
                        // ignore it
                    } else {
                        res = this.END_STATUS;
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
                    } else {
                        throw new Error('Can not start a word with ' + symbol);
                    }
                } else if (isChar && this.canAddChar()) {
                    this._addSymbol(symbol);
                } else if (isNumber && this.canAddNumber()) {
                    this._addSymbol(symbol);
                } else if (this.isDot(symbol) && this.isNumber()) {
                    this.setType(this.FLOAT_TYPE)
                        ._addSymbol(symbol);
                } else if (this.isOperandSymbol(symbol)) {
                    if (this.isOperand() && this.canAddToOperand(symbol)) {
                        console.log('add at ', symbol, this.readedSubstr);
                        this._addSymbol(symbol);
                    } else {
                        console.log('stop at ', symbol, this.readedSubstr);
                        res = this.END_STATUS;
                    }                    
                } else if (this.isOperand()) {
                    console.log('stop at ', symbol, this.readedSubstr);
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
                return parent[this.readedSubstr];
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
        },
        getOperand: function () {
            return this.readedSubstr;
        },
        getOperandPriority: function () {
            return operandPriority[this.readedSubstr];
        },
        getOperandArgumentsLength: function () {
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
            return (symbol === this.DOT);
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
                (symbol === this.EXCLAMATION_MARK)
            );
        },
        canAddToOperand: function (symbol) {
            return (
                // for logical "and"
                ((this.readedSubstr === this.AND_SYMBOL) && (symbol === this.AND_SYMBOL)) ||
                // for logical "or"
                ((this.readedSubstr === this.VERTICAL_LINE) && (symbol === this.VERTICAL_LINE))
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
        }
    };

    function _evalStack (stack, parent) {
        var res, value, element,
            argumentsArray, argumentsCount;
        res = [ ];
        for (var i = 0, l = stack.length; i < l; i++) {
            element = stack[i];
            value = element.getValue(parent);
            if (element.isOperand()) {
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
            outputArray, operandsStack, operand;

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
                if (currentWord.isString()) {
                    // need to increase pointer
                    pointer++
                }
                if (currentWord.isOperand()) {
                    console.log('operand found: ', currentWord.readedSubstr);
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
                } else {
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