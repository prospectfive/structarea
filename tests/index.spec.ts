import 'mocha';
import { assert } from 'chai';

import StructArea from '../src/index';

describe('NPM Package', () => {
  it('should be an object', () => {
    assert.isFunction(StructArea);
  });
});
