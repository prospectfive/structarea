import React, { useEffect, useRef, useState } from 'react';
import { validateJSON } from './validator';
const KEY_TAB = 'Tab';
const KEY_ENTER = 'Enter';
const formatJSON = (s) => {
    let json = JSON.parse(s);
    return JSON.stringify(json, null, 2)
        .replace(/\\\"/g, '"')
        .replace(/\n/g, '\r\n');
};
export const StructArea = (props) => {
    const cursor = useRef(null);
    const [position, setPosition] = useState(0);
    const [invalidLine, setInvalidLine] = useState(0);
    const [invalidChar, setInvalidChar] = useState('');
    const [structErr, setStructErr] = useState('');
    useEffect(() => {
        const debouncedValidate = setTimeout(() => {
            const result = validateJSON(props.value, props.struct);
            // TODO: find a way to persist result when user is fixing
            //       should continue to show what's missing even though JSON will be invalid
            setInvalidLine(result?.error?.line || 0);
            setInvalidChar(result?.error?.char || '');
            setStructErr(result?.message || '');
            if (!result?.error && props.autoFormat) {
                props.onChange({
                    target: { value: formatJSON(props.value) },
                });
            }
        }, props.validationDelay || 500);
        return () => clearTimeout(debouncedValidate);
    }, [props.value]);
    useEffect(() => {
        if (cursor?.current) {
            cursor.current.selectionStart = cursor.current.selectionEnd = position;
        }
    }, [position]);
    const handleKeyDown = (e) => {
        // TODO: do something different when text is highlighted, tab by line instead?
        // if (window.getSelection()?.toString()) {
        //   console.log(window.getSelection()?.toString())
        //   return
        // }
        const { selectionStart, selectionEnd, value } = e.target;
        if (e.key === KEY_ENTER) {
            e.preventDefault();
            const prevChar = value.charAt(selectionStart - 1);
            let indent = 0;
            let newContent;
            for (let i = selectionStart - 1; i >= 0; i--) {
                if (value.charAt(i) === '\n') {
                    indent =
                        value.substring(i + 1, selectionStart).match(/^\s*/)?.[0].length ??
                            0;
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
            props.onChange({
                ...e,
                target: { ...e.target, value: newContent },
            });
        }
        if (e.key === '{' || e.key === '[') {
            if (props.closeBrackets) {
                e.preventDefault();
                const bracket = e.key === '{' ? '}' : ']';
                const newContent = value.slice(0, selectionStart) +
                    e.key +
                    bracket +
                    value.slice(selectionEnd);
                props.onChange({
                    ...e,
                    target: { ...e.target, value: newContent },
                });
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
                props.onChange({
                    ...e,
                    target: { ...e.target, value: newContent },
                });
            }
        }
        else if (e.key === KEY_TAB) {
            e.preventDefault();
            const newContent = value.substring(0, selectionStart) +
                '  ' +
                value.substring(selectionEnd);
            setPosition(selectionStart + 2); // forward 2 because we added 2 spaces
            props.onChange({
                ...e,
                target: { ...e.target, value: newContent },
            });
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("style", { dangerouslySetInnerHTML: {
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
        React.createElement("div", { style: { display: 'inline-flex', justifyContent: 'space-evenly' } },
            React.createElement("div", { className: 'container' },
                React.createElement("div", { className: 'lineCount' }, props.value.split('\n').map((v, k) => (React.createElement("span", { key: k, style: {
                        textDecoration: k + 1 === invalidLine ? 'underline red 4px' : 'none',
                    } })))),
                React.createElement("textarea", { style: {
                        ...(props.extraStyles || {}),
                        lineHeight: `${props.lineHeight || 20}px`,
                        padding: 0,
                        background: props.bgColor || 'inherit',
                        color: props.textColor || 'inherit',
                        minWidth: `${props.minWidth || 500}px`,
                        outline: props.outline || 'none',
                        resize: props.resize || 'none',
                    }, ref: cursor, onKeyDown: handleKeyDown, onChange: props.onChange, value: props.value, spellCheck: false })),
            React.createElement("div", null,
                structErr && (React.createElement("pre", { style: { textDecoration: 'underline red' } }, structErr)),
                invalidChar && (React.createElement("pre", { style: {
                        marginTop: `${(props.lineHeight || 20) * invalidLine}px`,
                        textDecoration: 'underline red',
                    } },
                    "Unexpected Character ",
                    `'${invalidChar}'`))))));
};
export default StructArea;
