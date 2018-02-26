F.define(
    'core/trim',
    'core/eval',
function () {
    'use strict';

    return {
        inject: function (tpl) {
            var generatedTpl, re, match, matchStr, matchArr, computedValue;

            generatedTpl = F.clone(tpl);
            re = /[a-z]+={[^}]+}/gi
            while ((match = re.exec(generatedTpl)) !== null) {
                F.debug(F.trim(match[0].replace(/(\s{2,})|\n|\t/gi, ' ')));
                
                matchStr = F.trim(match[0].replace(/(\s{2,})|\n|\t/gi, ' ')).slice(0, -1);

                matchArr = matchStr.split('={');
                computedValue = F.eval(matchArr[1], {
                    $options: this.options,
                    $state: this.state,
                    $ctrl: this
                });

                generatedTpl = generatedTpl.substr(0, match.index) + 
                    matchArr[0] +
                    '="' + 
                    computedValue.value + '"' +
                generatedTpl.substr(match.index + match[0].length);
            }

            return generatedTpl;
        }
    };
});
