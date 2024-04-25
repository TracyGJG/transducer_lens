import { expect, jest, test } from '@jest/globals';

import { append, compose, logger, pipe, range } from './utils.js';

describe('Utils', () => {
  const logSpy = jest.spyOn(console, 'log');

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('append (no items)', () => {
    const testArray = [];
    const appendFunction = append(testArray);

    expect(testArray.length).toBe(0);
    expect(typeof appendFunction).toBe('function');

    appendFunction('Hello, World!');
    expect(testArray.length).toBe(1);
    expect(testArray).toEqual(['Hello, World!']);
  });

  test('append (single item)', () => {
    const testArray = [];
    const result = append(testArray, 'item1');

    expect(testArray.length).toBe(1);
    expect(typeof result).toBe('object');
    expect(result).toEqual(['item1']);
  });

  test('append (multiple items)', () => {
    const testArray = [];
    const result = append(testArray, 'item1', 'item2', 'item3');

    expect(testArray.length).toBe(3);
    expect(typeof result).toBe('object');
    expect(result).toEqual(['item1', 'item2', 'item3']);
  });

  test('compose', () => {
    const alpha = x => x + 1;
    const beta = x => x * 3;

    const gamma = compose(alpha, beta);
    const delta = compose(beta, alpha);

    expect(gamma(3)).toBe(alpha(beta(3)));
    expect(delta(3)).toBe(beta(alpha(3)));
  });

  test('pipe', () => {
    const alpha = x => x + 1;
    const beta = x => x * 3;

    const gamma = pipe(alpha, beta);
    const delta = pipe(beta, alpha);

    expect(gamma(3)).toBe(
      (x => {
        const y = alpha(x);
        return beta(y);
      })(3)
    );
    expect(delta(3)).toBe(
      (x => {
        const y = beta(x);
        return alpha(y);
      })(3)
    );
  });

  test('logger (with function)', () => {
    const defaultLogger = logger('test');
    expect(typeof defaultLogger).toBe('function');

    const loggerFn = logger('test', val => `${val}, World!`);
    expect(typeof loggerFn).toBe('function');

    expect(logSpy).toHaveBeenCalledTimes(0);
    const result = loggerFn('Hello');
    expect(result).toBe('Hello, World!');
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      '\ttest: "Hello" \n\t\t=> "Hello, World!"'
    );
  });

  test('logger (with default)', () => {
    const defaultLogger = logger('test');
    expect(typeof defaultLogger).toBe('function');

    const loggerFn = logger('test');
    expect(typeof loggerFn).toBe('function');

    expect(logSpy).toHaveBeenCalledTimes(0);
    const result = loggerFn('Hello');
    expect(result).toBe('Hello');
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('\ttest: "Hello" \n\t\t=> "Hello"');
  });

  test('range', () => {
    expect(range(3)).toEqual([0, 1, 2]);
    expect(range(3, 3)).toEqual([3, 4, 5]);
    expect(range(3, 3, 3)).toEqual([3, 6, 9]);
  });
});
