interface JSONParseError {
    char?: string;
    line?: number;
    message?: string;
}
interface ValidationError {
    error?: JSONParseError;
    message?: string;
}
export declare function validateJSON(rawJSON: string, expectedStruct: object): ValidationError | null;
export {};
//# sourceMappingURL=validator.d.ts.map