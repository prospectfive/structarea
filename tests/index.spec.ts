import 'mocha';
import { assert } from 'chai';

import { whatIsThis, whyIsThis } from '../src/index';
import npmPackage from '../src/index';

describe('NPM Package', () => {
  it('should be an object', () => {
    assert.isObject(npmPackage);
  });

  it('should have a whatIsThis property', () => {
    assert.property(npmPackage, 'whatIsThis');
  });
});

describe('Hello World Function', () => {
  it('should be a function', () => {
    assert.isFunction(whatIsThis);
  });

  it('should return the hello world message', () => {
    const expected = 'Like a <textarea /> for structured data, I guess.';
    const actual = whatIsThis();
    assert.equal(actual, expected);
  });
});

describe('whyIsThis Function', () => {
  it('should be a function', () => {
    assert.isFunction(whyIsThis);
  });

  it('should return the whyIsThis message', () => {
    const expected = 'For fun, to learn TypeScript and how to publish an npm package.';
    const actual = whyIsThis();
    assert.equal(actual, expected);
  });
});