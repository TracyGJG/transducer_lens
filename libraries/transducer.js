import { append, compose } from './utils.js';

export function composeTransducers(...transducerFns) {
  const xf = compose(...transducerFns);
  return xs => xs.reduce((__, _, ___) => xf(append)(__, _), []);
}

export function conditional(conditionFn) {
  return (...transformFns) =>
    rf =>
    (acc, val) =>
      rf(acc, transformFns[+conditionFn(val)](val));
}

export function extract(extractArray, retainOriginal = false) {
  const _extract = (rf, acc, val) => {
    extractArray.push(val);
    return retainOriginal ? rf(acc, val) : acc;
  };
  return (...predicateFns) =>
    rf =>
    (acc, val) => {
      const result = predicateFns.some(func => func(val))
        ? _extract(rf, acc, val)
        : rf(acc, val);
      return result;
    };
}

export function filter(...predicateFns) {
  return rf => (acc, val) => {
    const result = predicateFns.every(func => func(val)) ? rf(acc, val) : acc;
    return result;
  };
}

export function mapper(...transformFns) {
  return rf => (acc, val) =>
    rf(
      acc,
      transformFns.reduce((x, func) => func(x), val)
    );
}
