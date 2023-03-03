interface JSONParseError {
  char?: string;
  line?: number;
  message?: string;
}

interface ValidationError {
  error?: JSONParseError
  message?: string;
}

interface ValidationObject {
  [key: string]: any
}

export function validateJSON(rawJSON: string, expectedStruct: object): ValidationError | null {
  try {
    const parsedJSON = JSON.parse(rawJSON)
    const message = validateExpectedStructure(parsedJSON, expectedStruct)
    if (message) {
      return { message }
    }
  } catch (error) {
    const err = error as SyntaxError
    if (err instanceof SyntaxError) {
      const match = /\bat position (\d+)/.exec(err.message)
      if (match) {
        const position = parseInt(match[1], 10)
        let line = 1
        let char = ''
        for (let i = 0; i < position; i++)  {
          if (rawJSON[i] === '\n') {
            line++
            char = ''
          } else if (!/\s/.test(rawJSON[i])) {
            char = rawJSON[i]
          }
        }
        return { error: { char, line } }
      }
      return { error: { message: err.message } }
    }
  }
  return null
}

function validateExpectedStructure(json: any, expected: object, keyPath: string = ''): string | null {
  if (Array.isArray(json)) {
    return validateArrayStructure(json, expected, keyPath)
  }
  return validateObjectStructure(json, expected, keyPath)
}

function validateArrayStructure(arr: any, expected: object, keyPath: string): string | null {
  if (!Array.isArray(expected)) {
    return `Key at "${keyPath}0": expecting <${typeof expected}>, got <array>`
  }
  if (!arr.length) {
    return `Key at "${keyPath}0": is empty, expecting <${typeof expected[0]}>`
  }
  const expectedType = typeof expected[0]
  for (const idx in arr) {
    const arrType = typeof arr[idx]
    const newKeyPath = `${keyPath}${idx}.`
    if (arrType !== expectedType) {
      return `Key at "${newKeyPath}": expected <${expectedType}>, got <${arrType}>`
    }
    if (expectedType === 'object') {
      const message =  validateExpectedStructure(arr[idx], expected[0], `${newKeyPath}`)
      if (message) {
        return message
      }
    }
  }
  return null
}

function validateObjectStructure(obj: ValidationObject, expected: ValidationObject, keyPath: string): string | null {
  if (typeof obj === 'object'){
    for (const key in obj) {
      if (!expected.hasOwnProperty(key)) {
        return `Unexpected key: "${keyPath}${key}"`
      }
    }
  }
  for (const key in expected) {
    const expectedType = Array.isArray(expected[key]) ? 'array' : typeof expected[key]
    const actualType = Array.isArray(obj[key]) ? 'array' : typeof obj[key]

    if (!obj.hasOwnProperty(key)) {
      return `Missing key "${keyPath}${key}": expecting <${expectedType}>`
    }

    if (Array.isArray(expected[key])) {
      const message = validateArrayStructure(obj[key], expected[key], `${keyPath}${key}.`)
      if (message) {
        return message
      }
    }

    if (expectedType !== actualType) {
      return `Key at "${keyPath}${key}": expected <${expectedType}>, got <${actualType}>`
    }

    if (expectedType === 'object' && expected[key] !== null) {
      return validateExpectedStructure(
        obj[key],
        expected[key],
        `${keyPath}${key}.`
      )
    }
  }
  return null
}