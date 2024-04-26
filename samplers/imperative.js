import { logger, not } from '../libraries/utils.js';

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

console.log('\ninputData', inputData);

// Step 1
const validInputData = inputData.filter(isTruthy);
console.log('\nvalidInputData', validInputData);

// Step 2a
const invalidTemperatures = validInputData.filter(
  not(isTemperatureString)
);
console.log('\ninvalidTemperatures', invalidTemperatures);

// Step 2b
const validTemperatures = validInputData.filter(isTemperatureString);
console.log('\nvalidTemperatures', validTemperatures);

// Step 3
const temperatureSimpleObjects =
  validTemperatures.map(convertIntoObject);
console.table(temperatureSimpleObjects);

// Step4
const temperatureComplexObjects = temperatureSimpleObjects.map(tempObj =>
  logger('isCelsius', isCelsius)(tempObj) ? 
    // Step 4a
    logger('processCelsius', processCelsius)(tempObj) : 
    // Step 4b
    logger('processFahrenheit', processFahrenheit)(tempObj)
);
console.table(temperatureComplexObjects);

// ==========================================================

console.table(
  inputData
    .filter(logger('isTruthy', isTruthy))
    .filter(logger('isTemperatureString', isTemperatureString))
    .map(logger('convertIntoObject', convertIntoObject))
    .map(tempObj =>
      logger('isCelsius', isCelsius)(tempObj) ? 
      logger('processCelsius', processCelsius)(tempObj) : 
      logger('processFahrenheit', processFahrenheit)(tempObj)
    )
);
