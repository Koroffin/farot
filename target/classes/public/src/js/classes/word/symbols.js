F.define(
	'json!./symbols',
	'core/assign',
function (symbols) {
	'use strict';

	return F.assign({
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
        }
	}, symbols);
});