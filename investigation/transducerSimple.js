import { append, compose, logger } from '../libraries/utils.js';
import {
  conditional,
  extract,
  filter,
  mapper,
} from '../libraries/transducer.js';

export function composeTransducers(...transducerFns) {
  const xf = compose(...transducerFns);
  return xs =>
    xs.reduce((__, _, ___) => {
      console.log(`transduce[${___}]:`, _);
      return xf(append)(__, _);
    }, []);
}

// ==========================================================

// transforms
const multiple = x => y => y * x;
const double = multiple(2);

const add = x => y => y + x;
const inc = add(1);

// predicates
const isOdd = x => !!(x % 2);
const isEven = x => !isOdd(x);
const lessThan = x => y => y < x;

// extract helpers
const extractedArray = [];

// ==========================================================

const transducer = composeTransducers(
  filter(logger('isEven', isEven), logger('lessThan 8', lessThan(8))),

  mapper(logger('double', double), logger('inc', inc)),

  conditional(lessThan(10))(logger('*false'), logger('*true')),

  extract(extractedArray)(logger('lessThan 10', lessThan(10)))
);

// ==========================================================

const inputData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(`\ninputData: ${inputData}\n`);

console.log('\ntransducedArray:', transducer(inputData));

console.log(`\nextractedArray: [${extractedArray}]\n`);
