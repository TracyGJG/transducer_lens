import { expect, jest, test } from '@jest/globals';

import {
  composeTransducers,
  conditional,
  extract,
  filter,
  mapper,
} from './transducer.js';

describe('Utils', () => {
  describe('composeTransducers', () => {});

  describe('conditional', () => {});

  describe('extract', () => {});

  describe('filter', () => {
    const lessThan10 = _ => _ < 10;
    const greaterThan5 = _ => _ > 5;
    const conj = (acc, val) => [...acc, val];

    // afterEach(() => {
    //   jest.resetAllMocks();
    // });

    it('returns a function when called', () => {
      const filterFn = filter(lessThan10, greaterThan5);
      expect(typeof filterFn).toBe('function');

      const conjoinedFilter = filterFn(conj);
      expect(typeof conjoinedFilter).toBe('function');
    });

    it('extends the array when value passes', () => {
      const conjoinedFilter = filter(lessThan10, greaterThan5)(conj);

      const result = conjoinedFilter([9], 7);
      expect(result).toEqual([9, 7]);
    });

    it('leaves the array unchanged when value is below range', () => {
      const conjoinedFilter = filter(lessThan10, greaterThan5)(conj);

      const result = conjoinedFilter([8], 5);
      expect(result).toEqual([8]);
    });

    it('leaves the array unchanged when value is above range', () => {
      const conjoinedFilter = filter(lessThan10, greaterThan5)(conj);

      const result = conjoinedFilter([8], 10);
      expect(result).toEqual([8]);
    });
  });

  describe('mapper', () => {});
});
