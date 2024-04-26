import { append, compose, logger, not } from '../libraries/utils.js';
import {
  conditional,
  extract,
  filter,
  mapper,
} from '../libraries/transducer.js';

import inputData from './temperatures.json' with { type: 'json' };

import {
  isTruthy,
  isTemperatureString,
  isCelsius,
  convertIntoObject,
  processCelsius,
  processFahrenheit
} from './exampleOne.js';

// ==========================================================

export function composeTransducers(...transducerFns) {
  const xf = compose(...transducerFns);
  return xs =>
    xs.reduce((acc, val, arr) => {
      console.log(`transduce[${arr}]:`, val);
      return xf(append)(acc, val);
    }, []);
}

// ==========================================================

const invalidTemperatures = [];

const transducer = composeTransducers(
  // Step 1
  filter(logger('isTruthy', isTruthy)),
  // Step 2
  extract(invalidTemperatures)(
    logger('not(isTemperatureString)', not(isTemperatureString))
  ),
  // Step 3
  mapper(logger('convertIntoObject', convertIntoObject)),
  // Step 4
  conditional(isCelsius)(
    // Step 4a
    logger('processFahrenheit:', processFahrenheit),
    // Step 4b
    logger('processCelsius:', processCelsius)
  )
);

// ==========================================================

const temperatureComplexObjects = transducer(inputData);
console.log('\ninvalidTemperatures:', invalidTemperatures);

console.table(temperatureComplexObjects);
console.log(temperatureComplexObjects);
