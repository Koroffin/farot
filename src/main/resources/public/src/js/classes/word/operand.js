F.define(
	'json!./operandPriority',
function (operandPriority) {
	'use strict';

	return {
        getOperand: function () {
            return this.readedSubstr;
        },
        getOperandPriority: function () {
            return F.isDefined(operandPriority[this.readedSubstr]) ? operandPriority[this.readedSubstr] : Infinity;
        },
        getOperandArgumentsLength: function () {
            if (F.isDefined(this.argumentsCount)) {
                return this.argumentsCount + 1; // + 1 for the function _caller
            }
            if (this.isLogicalNot()) {
                return 1;
            }
            if (this.isCondition()) {
                return 3;
            }
            return 2;
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
});