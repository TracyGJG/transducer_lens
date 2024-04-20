import { append, compose } from './utils.js';

export function mapper(...transformFns) {
  return rf => (acc, val) =>
    rf(
      acc,
      transformFns.reduce((x, func) => func(x), val)
    );
}

export function conditional(conditionFn) {
  return (...transformFns) =>
    rf =>
    (acc, val) =>
      rf(acc, transformFns[+conditionFn(val)](val));
}

export function filter(...predicateFns) {
  return rf => (acc, val) =>
    predicateFns.every(func => func(val)) ? rf(acc, val) : (val, acc);
}

export function extract(extractArray) {
  return predicateFn => rf => (acc, val) =>
    predicateFn(val) ? rf(acc, val) : (append(extractArray)(val), acc);
}

export function composeTransducers(...transducerFns) {
  const xf = compose(...transducerFns);
  return xs => xs.reduce((__, _, ___) => xf(append)(__, _), []);
}
