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
    xs.reduce((acc, val, arr) => {
      console.log(`transduce[${arr}]:`, val);
      return xf(append)(acc, val);
    }, []);
}

// ==========================================================

// predicates
const isTruthy = Boolean;
const isNotTemperatureString = inputString =>
  !/^-?\d{1,4}(\.\d\d?)?°[CF]$/.exec(inputString);
const isCelsius = objTemperature => objTemperature.unit === 'C';

// transforms
const convertIntoObject = validString => {
  const [numeric, unit] = validString.split(/°/);
  return {
    numeric,
    unit,
  };
};
const processCelsius = ({ numeric }) => ({
  celsius: +numeric,
  fahrenheit: (+numeric / 5) * 9 + 32,
});
const processFahrenheit = ({ numeric }) => ({
  celsius: ((+numeric - 32) / 9) * 5,
  fahrenheit: +numeric,
});

// ==========================================================

const inputData = [
  '0°C',
  '',
  'Invalid String',
  0,
  '-40°F',
  null,
  '273.15K',
  false,
  '100°C',
];
const invalidTemperatures = [];

// ==========================================================

const transducer = composeTransducers(
  filter(logger('isTruthy', isTruthy)),
  extract(invalidTemperatures)(
    logger('isTemperatureString', isNotTemperatureString)
  ),
  mapper(logger('convertIntoObject', convertIntoObject)),
  conditional(isCelsius)(
    logger('processFahrenheit:', processFahrenheit),
    logger('processCelsius:', processCelsius)
  )
);

// ==========================================================

const temperatureComplexObjects = transducer(inputData);

console.log('\ninvalidTemperatures:', invalidTemperatures);

console.table(temperatureComplexObjects);
