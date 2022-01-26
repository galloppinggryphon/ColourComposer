"use strict"

//media\(\n\s*\(\n(.*)\n\s*\)\n\s*\)

//https://stylelint.io/user-guide/rules/list

//https://github.com/bjankord/stylelint-config-sass-guidelines/blob/main/src/.stylelintrc.json
//https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
//https://github.com/kristerkari/stylelint-scss
//"stylelint-config-idiomatic-order": https://github.com/ream88/stylelint-config-idiomatic-order/blob/master/index.js

module.exports = {

    //"ignoreFiles": ["**/*.js"],
    "plugins": ["stylelint-scss", "stylelint-order"],

    //"stylelint-config-sass-guidelines"

    "extends": ["stylelint-config-standard", "stylelint-config-sass-guidelines"],
    "rules": {
        "string-quotes": "double",
        "selector-class-pattern": "",
        "indentation": "tab",
        "function-parentheses-space-inside": "always-single-line",
        "no-descending-specificity": null,
        "color-named": null,
        "order/order": [
            [
                "custom-properties",
                "dollar-variables"
            ]
        ],
        "order/properties-alphabetical-order": null,
        "shorthand-property-no-redundant-values": null, //easier to read
        "selector-no-qualifying-type": null, //sometimes necessary
        "max-empty-lines": 4,
        "scss/at-mixin-pattern": "",
        "number-no-trailing-zeros": null,
        "max-nesting-depth": 4,
        "selector-max-compound-selectors": 4,
        "selector-max-id": 1,
        "value-list-max-empty-lines": 1,
        "scss/dollar-variable-pattern": "",


        //"selector-combinator-space-before": null,
        //"selector-combinator-space-after": null,

        
        
        //     "block-opening-brace-newline-after": "always-multi-line",
        //     "declaration-colon-space-after": "always",
        //     //"selector-pseudo-element-case": "lower",

        //     "function-comma-space-after": "always-single-line",
        //     "function-parentheses-space-inside": "always",
        //     //"indentation": "tab",
        //     "max-nesting-depth": 10,
        //     "no-extra-semicolons": true,
        //     "string-quotes": "double",
        //     "selector-max-compound-selectors": 10,
        //     // "scss/at-mixin-parentheses-space-before": "always",
        //     // "scss/function-color-relative": true,
        //     "scss/operator-no-unspaced": true
        //     //# "selector-no-qualifying-type":   null
        //     //# "scss/at-extend-no-missing-placeholder": null,
        //     //# "scss/at-function-parentheses-space-before": null,
    }
}