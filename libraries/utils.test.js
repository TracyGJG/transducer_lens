import { expect, jest, test } from '@jest/globals';

import { append, compose, logger, range } from './utils.js';

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

    expect(testArray.length).toBe(0);
    appendFunction('Hello, World!');

    expect(testArray.length).toBe(1);
    expect(testArray[0]).toBe('Hello, World!');
  });

  test('append (single item)', () => {
    const testArray = [];
    const result = append(testArray, 'item1');

    expect(testArray.length).toBe(1);
    expect(typeof result).toBe('object');

    expect(testArray.length).toBe(1);
    expect(result).toEqual(['item1']);
  });

  test('compose', () => {
    const testArray = [];

    const hello = _ => (testArray.push(`Hello, ${_}`), _);
    const world = _ => (testArray.push(`World! ${_}`), _);

    expect(testArray.length).toBe(0);
    const combined = compose(hello, world);

    expect(testArray.length).toBe(0);
    combined('_');

    expect(testArray.length).toBe(2);
    expect(testArray).toEqual(['World! _', 'Hello, _']);
  });

  test('logger (with function)', () => {
    const defaultLogger = logger('test');
    expect(typeof defaultLogger).toBe('function');

    const loggerFn = logger('test', _ => `${_}, World!`);
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
