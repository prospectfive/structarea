import React from 'react';
interface StructAreaProps {
    /**Required: the underlying textarea's value, should be tracked in state by your app */
    value: string;
    /**Required: the underlying textarea's onChange handler, should update tracked state by your app */
    onChange: React.ChangeEventHandler;
    /**Required: an example JSON object to validate against i.e. ["foo"] or {"foo":"bar"} */
    struct: object;
    /**Optional (default=2): number of spaces to use for indentation */
    indent?: number;
    /**Optional (default=500): number of milliseconds to delay before performing validation.*/
    validationDelay?: number;
    /**Optional (default=false): automatically format the textarea when JSON passes validation */
    autoFormat?: boolean;
    /**Optional (default=false): automatically insert closing brackets i.e. ']' or '}' */
    closeBrackets?: boolean;
    /**Optional (default=20): line height inside the textarea */
    lineHeight?: number;
    /**Optional (default='inherit'): background color of the textarea */
    bgColor?: string;
    /**Optional (default='inherit'): text color of the textarea */
    textColor?: string;
    /**Optional (default=500): minimum width of the textarea in pixels */
    minWidth?: number;
    /**Optional (default='none'): outline for the textarea when focused*/
    outline?: string;
    /**Optional (default='none'): textarea resize options */
    resize?: 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline';
    /**Optional: extra CSS properties to add to the textarea. Note: StructAreaProps take precendence.*/
    extraStyles?: {
        [cssProperty: string]: string;
    };
}
export declare const StructArea: React.FC<StructAreaProps>;
export default StructArea;
//# sourceMappingURL=StructArea.d.ts.map