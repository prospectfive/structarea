export function whatIsThis(): string {
  return 'Like a <textarea /> for structured data, I guess.'
}

export function whyIsThis(): string {
  return 'For fun, to learn TypeScript and how to publish an npm package.'
}

export default {
  whatIsThis,
  whyIsThis,
}

export * from './components/StructArea';