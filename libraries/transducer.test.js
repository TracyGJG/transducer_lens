import { expect, jest, test } from '@jest/globals';

import {
  composeTransducers,
  conditional,
  extract,
  filter,
  mapper,
} from './transducer.js';

describe('transducers', () => {
  const lessThan = __ => _ => _ < __;
  const greaterThan = __ => _ => _ > __;
  const plus = __ => _ => _ + __;
  const times = __ => _ => _ * __;

  const conj = (acc, val) => [...acc, val];

  describe('composeTransducers', () => {
    const sourceData = [5, 10, 20, 30];
    const extractedData = [];

    const transducer = composeTransducers(
      filter(greaterThan(15)), // [20, 30]
      mapper(times(2)), // [40, 60]
      extract(extractedData, true)(lessThan(50)), // [40, 60] & [40]
      conditional(lessThan(50))(plus(-18), plus(2))
    );

    it('processes data in a single pass', () => {
      const result = transducer(sourceData);
      expect(result).toEqual([42, 42]);
      expect(extractedData).toEqual([40]);
    });
  });

  describe('conditional', () => {
    const make42 = conditional(lessThan(30))(plus(1), times(2))(conj);

    it('selects the first mapper when greater than 30', () => {
      const result = make42([666], 41);
      expect(result).toEqual([666, 42]);
    });

    it('selects the second mapper when less than 30', () => {
      const result = make42([666], 21);
      expect(result).toEqual([666, 42]);
    });
  });

  describe('extract', () => {
    it('returns a function when called', () => {
      const extractedData = [];
      const filterFn = extract(extractedData)(lessThan(5), greaterThan(10));
      expect(typeof filterFn).toBe('function');

      const conjoinedFilter = filterFn(conj);
      expect(typeof conjoinedFilter).toBe('function');
    });

    it('extends the array when value passes', () => {
      const extractedData = [];
      const conjoinedFilter = extract(extractedData)(
        lessThan(5),
        greaterThan(10)
      )(conj);

      const result = conjoinedFilter([9], 7);
      expect(result).toEqual([9, 7]);
      expect(extractedData).toEqual([]);
    });

    it('leaves the array unchanged when value is below range', () => {
      const extractedData = [];
      const conjoinedFilter = extract(extractedData)(
        lessThan(5),
        greaterThan(10)
      )(conj);

      const result = conjoinedFilter([8], 4);
      expect(result).toEqual([8]);
      expect(extractedData).toEqual([4]);
    });

    it('leaves the array unchanged when value is above range (retaining original)', () => {
      const extractedData = [];
      const RETAIN_ORIGINAL = true;
      const conjoinedFilter = extract(extractedData, RETAIN_ORIGINAL)(
        lessThan(5),
        greaterThan(10)
      )(conj);

      const result = conjoinedFilter([8], 16);
      expect(result).toEqual([8, 16]);
      expect(extractedData).toEqual([16]);
    });
  });

  describe('filter', () => {
    it('returns a function when called', () => {
      const filterFn = filter(lessThan(10), greaterThan(5));
      expect(typeof filterFn).toBe('function');

      const conjoinedFilter = filterFn(conj);
      expect(typeof conjoinedFilter).toBe('function');
    });

    it('extends the array when value passes', () => {
      const conjoinedFilter = filter(lessThan(10), greaterThan(5))(conj);

      const result = conjoinedFilter([9], 7);
      expect(result).toEqual([9, 7]);
    });

    it('leaves the array unchanged when value is below range', () => {
      const conjoinedFilter = filter(lessThan(10), greaterThan(5))(conj);

      const result = conjoinedFilter([8], 5);
      expect(result).toEqual([8]);
    });

    it('leaves the array unchanged when value is above range', () => {
      const conjoinedFilter = filter(lessThan(10), greaterThan(5))(conj);

      const result = conjoinedFilter([8], 10);
      expect(result).toEqual([8]);
    });
  });

  describe('mapper', () => {
    it('applies the given transform (plus(1) & times(2))', () => {
      const transducer = mapper(plus(1), times(2))(conj);
      const result = transducer([666], 20);

      expect(result).toEqual([666, 42]);
    });
  });
});
