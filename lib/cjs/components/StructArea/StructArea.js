"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructArea = void 0;
const react_1 = __importStar(require("react"));
const validator_1 = require("./validator");
const KEY_TAB = 'Tab';
const KEY_ENTER = 'Enter';
const formatJSON = (s) => {
    let json = JSON.parse(s);
    return JSON.stringify(json, null, 2)
        .replace(/\\\"/g, '"')
        .replace(/\n/g, '\r\n');
};
const StructArea = (props) => {
    const cursor = (0, react_1.useRef)(null);
    const [position, setPosition] = (0, react_1.useState)(0);
    const [invalidLine, setInvalidLine] = (0, react_1.useState)(0);
    const [invalidChar, setInvalidChar] = (0, react_1.useState)('');
    const [structErr, setStructErr] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const debouncedValidate = setTimeout(() => {
            var _a, _b;
            const result = (0, validator_1.validateJSON)(props.value, props.struct);
            // TODO: find a way to persist result when user is fixing
            //       should continue to show what's missing even though JSON will be invalid
            setInvalidLine(((_a = result === null || result === void 0 ? void 0 : result.error) === null || _a === void 0 ? void 0 : _a.line) || 0);
            setInvalidChar(((_b = result === null || result === void 0 ? void 0 : result.error) === null || _b === void 0 ? void 0 : _b.char) || '');
            setStructErr((result === null || result === void 0 ? void 0 : result.message) || '');
            if (!(result === null || result === void 0 ? void 0 : result.error) && props.autoFormat) {
                props.onChange({
                    target: { value: formatJSON(props.value) },
                });
            }
        }, props.validationDelay || 500);
        return () => clearTimeout(debouncedValidate);
    }, [props.value]);
    (0, react_1.useEffect)(() => {
        if (cursor === null || cursor === void 0 ? void 0 : cursor.current) {
            cursor.current.selectionStart = cursor.current.selectionEnd = position;
        }
    }, [position]);
    const handleKeyDown = (e) => {
        // TODO: do something different when text is highlighted, tab by line instead?
        // if (window.getSelection()?.toString()) {
        //   console.log(window.getSelection()?.toString())
        //   return
        // }
        var _a, _b;
        const { selectionStart, selectionEnd, value } = e.target;
        if (e.key === KEY_ENTER) {
            e.preventDefault();
            const prevChar = value.charAt(selectionStart - 1);
            let indent = 0;
            let newContent;
            for (let i = selectionStart - 1; i >= 0; i--) {
                if (value.charAt(i) === '\n') {
                    indent =
                        (_b = (_a = value.substring(i + 1, selectionStart).match(/^\s*/)) === null || _a === void 0 ? void 0 : _a[0].length) !== null && _b !== void 0 ? _b : 0;
                    break;
                }
            }
            if (prevChar === '{' || prevChar === '[') {
                newContent =
                    value.substring(0, selectionStart) +
                        `\n${' '.repeat(indent + 2)}\n` +
                        ' '.repeat(indent) +
                        value.substring(selectionEnd);
                indent += 2; // increment an extra 2 because we added 2 newlines
            }
            else {
                newContent =
                    value.substring(0, selectionStart) +
                        `\n${' '.repeat(indent)}` +
                        value.substring(selectionEnd);
            }
            setPosition(selectionStart + indent + 1);
            props.onChange(Object.assign(Object.assign({}, e), { target: Object.assign(Object.assign({}, e.target), { value: newContent }) }));
        }
        if (e.key === '{' || e.key === '[') {
            if (props.closeBrackets) {
                e.preventDefault();
                const bracket = e.key === '{' ? '}' : ']';
                const newContent = value.slice(0, selectionStart) +
                    e.key +
                    bracket +
                    value.slice(selectionEnd);
                props.onChange(Object.assign(Object.assign({}, e), { target: Object.assign(Object.assign({}, e.target), { value: newContent }) }));
                setPosition(selectionStart + 1);
            }
        }
        if (e.shiftKey && e.key === KEY_TAB) {
            e.preventDefault();
            const before = value
                .substring(0, selectionStart)
                .split('')
                .reverse()
                .join('');
            const tabIdx = before.indexOf('  ');
            const newlineIdx = before.indexOf('\n');
            if (tabIdx !== -1 && tabIdx < newlineIdx) {
                const newContent = before
                    .substring(tabIdx + 2)
                    .split('')
                    .reverse()
                    .join('') +
                    before.substring(0, tabIdx).split('').reverse().join('') +
                    value.substring(selectionEnd);
                setPosition(selectionStart - 2); // go backwards 2 because we removed 2 spaces
                props.onChange(Object.assign(Object.assign({}, e), { target: Object.assign(Object.assign({}, e.target), { value: newContent }) }));
            }
        }
        else if (e.key === KEY_TAB) {
            e.preventDefault();
            const newContent = value.substring(0, selectionStart) +
                '  ' +
                value.substring(selectionEnd);
            setPosition(selectionStart + 2); // forward 2 because we added 2 spaces
            props.onChange(Object.assign(Object.assign({}, e), { target: Object.assign(Object.assign({}, e.target), { value: newContent }) }));
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("style", { dangerouslySetInnerHTML: {
                __html: `.container {
            display: inline-flex;
            gap: 10px;
            font-family: monospace;
            line-height: ${props.lineHeight || 20}px;
            background: ${props.bgColor || 'inherit'};
            border-radius: 2px;
            padding: 20px 10px;
          }
          
          .lineCount {
            width: 20px;
            text-align: right;
          }
            
          .lineCount span {
            counter-increment:  linenumber;
          }
            
          .lineCount span::before {
            content: counter(linenumber);
            display: block;
            color: ${props.textColor || 'inherit'};
          }`,
            } }),
        react_1.default.createElement("div", { style: { display: 'inline-flex', justifyContent: 'space-evenly' } },
            react_1.default.createElement("div", { className: 'container' },
                react_1.default.createElement("div", { className: 'lineCount' }, props.value.split('\n').map((v, k) => (react_1.default.createElement("span", { key: k, style: {
                        textDecoration: k + 1 === invalidLine ? 'underline red 4px' : 'none',
                    } })))),
                react_1.default.createElement("textarea", { style: Object.assign(Object.assign({}, (props.extraStyles || {})), { lineHeight: `${props.lineHeight || 20}px`, padding: 0, background: props.bgColor || 'inherit', color: props.textColor || 'inherit', minWidth: `${props.minWidth || 500}px`, outline: props.outline || 'none', resize: props.resize || 'none' }), ref: cursor, onKeyDown: handleKeyDown, onChange: props.onChange, value: props.value, spellCheck: false })),
            react_1.default.createElement("div", null,
                structErr && (react_1.default.createElement("pre", { style: { textDecoration: 'underline red' } }, structErr)),
                invalidChar && (react_1.default.createElement("pre", { style: {
                        marginTop: `${(props.lineHeight || 20) * invalidLine}px`,
                        textDecoration: 'underline red',
                    } },
                    "Unexpected Character ",
                    `'${invalidChar}'`))))));
};
exports.StructArea = StructArea;
exports.default = exports.StructArea;
