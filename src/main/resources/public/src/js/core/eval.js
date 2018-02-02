(function (context) {
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

        ERROR_STATUS: 'error',
        OK_STATUS: 'ok',
        END_STATUS: 'end',

        STRING_MATCH: '\'',
        STRING_MATCH_DOUBLE: '"',

        DOT: '.',

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

                // Catching typical errors
                if (isChar && !this.canAddChar()) {
                    throw new Error('Can not add char ' + symbol + ' to word ' + this.readedSubstr);
                }
                if (isNumber && !this.canAddNumber()) {
                    throw new Error('Can not add number ' + symbol + ' to word ' + this.readedSubstr);
                }

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
                    } else {
                        throw new Error('Can not add start a word with ' + symbol);
                    }
                } else if (isChar && this.canAddChar()) {
                    this._addSymbol(symbol);
                } else if (isNumber && this.canAddNumber()) {
                    this._addSymbol(symbol);
                } else if (this.isDot(symbol) && this.isNumber()) {
                    this.setType(this.FLOAT_TYPE)
                        ._addSymbol(symbol);
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
        }
    };

    function _eval (str, parent) {
        var words, pointer, currentWord, res;

        words = [ ];
        pointer = 0;
        currentWord = new Word();

        while (F.isDefined(str[pointer])) {
            res = currentWord.addSymbol(str[pointer]);
            if (res !== Word.prototype.OK_STATUS) {
                break;
            }
            pointer++;
        }

        return currentWord.getValue(parent);
    }

    context.eval = _eval;

})(F);