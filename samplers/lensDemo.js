import { lens, lensFn } from '../libraries/lenses.js';

const testObject = {
  alpha: 'beta',
  gamma: {
    delta: 'epsilon',
    'zeta eta': 'theta',
  },
  iota: [
    'kappa',
    {
      lambda: 'mu',
    },
  ],
};

const testCases = [
  { specification: ['alpha'], value: 'beta' },
  { specification: ['gamma', 'delta'], value: 'epsilon' },
  { specification: ['gamma.delta'], value: 'epsilon' },
  { specification: ['gamma["zeta eta"]'], value: 'theta' },
  { specification: ['gamma', '"zeta eta"'], value: 'theta' },
  { specification: ['iota[0]'], value: 'kappa' },
  { specification: ['iota', 0], value: 'kappa' },
  { specification: ['iota', 1, 'lambda'], value: 'mu' },
];

const results = testCases.map(({ specification, value }) => ({
  specification,
  expected: value,
  actual: lens(...specification)(testObject),
}));

console.table(results);

testCases.forEach(({ specification, value }, index) => {
  lensFn(
    _ =>
      console.log(
        `${index + 1}, ${specification
          .toString()
          .padEnd(20, ' ')}=> ${value.padEnd(8, ' ')} = ${_}`
      ),
    ...specification
  )(testObject);
});
