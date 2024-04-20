import { expect, jest, test } from '@jest/globals';

import { lens, lensFn } from './lenses.js';

describe('Lenses', () => {
  const testData = {
    a: 'b',
    c: ['d', 'e'],
    f: {
      g: 'h',
      i: 'j',
    },
  };

  describe('lens', () => {
    it('can access a top-level property', () => {
      expect(lens('a')(testData)).toBe('b');
    });

    it('can access a array element (direct)', () => {
      expect(lens('c[1]')(testData)).toBe('e');
    });

    it('can access a array element (indirect)', () => {
      expect(lens('c', 1)(testData)).toBe('e');
    });

    it('can access a sub-level property (direct)', () => {
      expect(lens('f', 'i')(testData)).toBe('j');
    });

    it('can access a sub-level property (indirect dot notation)', () => {
      expect(lens('f.i')(testData)).toBe('j');
    });

    it('can access a sub-level property (indirect bracket notation)', () => {
      expect(lens('f["i"]')(testData)).toBe('j');
    });
  });

  describe('lensFn', () => {
    const testFn = jest.fn(_ => `_${_}`);

    it('can access a top-level property', () => {
      expect(testFn).toHaveBeenCalledTimes(0);
      expect(lensFn(testFn, 'a')(testData)).toBe('_b');
      expect(testFn).toHaveBeenCalledTimes(1);
    });
  });
});
