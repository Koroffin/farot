F.require('classes/word/word', function (Word) {
    'use strict';
    
    function _evalStack (stack, parent) {
        var res, value, element,
            argumentsArray, argumentsCount;
        res = [ ];
        for (var i = 0, l = stack.length; i < l; i++) {
            element = stack[i];
            value = element.getValue(parent);
            if (element.isOperand() || element.isFunction() || element.isCondition()) {
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
    function __popWhileCondition(operandsStack, outputArray, condition) {
        var operand;
        while (condition(operand = operandsStack.pop())) {
            outputArray.push(operand);
        }
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
                if (currentWord.isString() || currentWord.isComma() || currentWord.isDot()) {
                    // need to increase pointer
                    pointer++
                } 
                if (currentWord.isOperand()) {
                    // parse as operand
                    if (currentWord.isColon()) {
                        // pop untill '?'
                        __popWhileCondition(operandsStack, outputArray, function (operand) {
                            return !operand.isQuestionMark();
                        });
                        currentWord.setType(Word.prototype.CONDITION_TYPE);
                        operandsStack.push(currentWord);
                    } else if (currentWord.isCloseBracket()) {
                        // pop untill '('
                        __popWhileCondition(operandsStack, outputArray, function (operand) {
                            return !operand.isOpenBracket();
                        });
                        // checking the function on top
                        if (!F.isEmpty(operandsStack) && F.last(operandsStack).isFunction()) {
                            outputArray.push(operandsStack.pop());
                            currentFunction = currentFunction.previousFunction;
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
                    // pop untill "." on top
                    while (!F.isEmpty(operandsStack) && F.last(operandsStack).isDot()) {
                        outputArray.push(operandsStack.pop());
                    }
                    operandsStack.push(currentWord);
                    if (F.isDefined(currentFunction) && (currentFunction.function.argumentsCount === 0)) {
                        F.debug('here increase argumentsCount of ' + currentFunction.function.readedSubstr + ' because met the function ' + currentWord.readedSubstr);
                        currentFunction.function.argumentsCount++;
                    }
                    currentFunction = {
                        function: currentWord,
                        previousFunction: currentFunction
                    };
                } else if (currentWord.isComma()) {
                    if (F.isDefined(currentFunction)) {
                        F.debug('here increase argumentsCount of ' + currentFunction.function.readedSubstr + ' because met comma');
                        currentFunction.function.argumentsCount++;
                        // pop untill '('
                        while (!F.last(operandsStack).isOpenBracket()) {
                            operand = operandsStack.pop();
                            outputArray.push(operand);
                        }
                    } else {
                        F.error('Wrong syntax! Comma outside the function!');
                    }                    
                } else {
                    if (F.isDefined(currentFunction) && (currentFunction.function.argumentsCount === 0)) {
                        F.debug('here increase argumentsCount of ' + currentFunction.function.readedSubstr + ' because met first variable ' + currentWord.readedSubstr);
                        currentFunction.function.argumentsCount++;
                    }
                    if (!F.isEmpty(operandsStack) && F.last(operandsStack).isDot()) {
                        currentWord.setType(Word.prototype.STRING_TYPE);
                    }
                    outputArray.push(currentWord);
                }
                currentWord = new Word(currentWord);
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
            if (!F.isEmpty(operandsStack) && F.last(operandsStack).isDot()) {
                currentWord.setType(Word.prototype.STRING_TYPE);
            }
            outputArray.push(currentWord);
        }        

        // add all operands to output
        while (operand = operandsStack.pop()) {
            outputArray.push(operand);
        }

        F.debug('here is output: ', outputArray);

        return _evalStack(outputArray, parent);
    }

    F.eval = _eval;

    return _eval;
});
