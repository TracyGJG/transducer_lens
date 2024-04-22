// predicates
const isTemperatureString = inputString =>
  /^-?\d{1,4}(\.\d\d?)?°[CF]$/.exec(inputString);
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

console.log('\ninputData', inputData);

// ==========================================================

const invalidInputData = inputData.filter(datum => !Boolean(datum));
console.log('\ninvalidInputData', invalidInputData);

const validInputData = inputData.filter(datum => Boolean(datum));
console.log('\nvalidInputData', validInputData);

const invalidTemperatures = validInputData.filter(
  temp => !isTemperatureString(temp)
);
console.log('\ninvalidTemperatures', invalidTemperatures);

const validTemperaturesStrings = validInputData.filter(isTemperatureString);
console.log('\nvalidTemperaturesStrings', validTemperaturesStrings);

const temperatureSimpleObjects =
  validTemperaturesStrings.map(convertIntoObject);
console.table(temperatureSimpleObjects);

const temperatureComplexObjects = temperatureSimpleObjects.map(tempObj =>
  isCelsius(tempObj) ? processCelsius(tempObj) : processFahrenheit(tempObj)
);
console.table(temperatureComplexObjects);

// ==========================================================

console.table(
  inputData
    .filter(datum => Boolean(datum))
    .filter(isTemperatureString)
    .map(convertIntoObject)
    .map(tempObj =>
      isCelsius(tempObj) ? processCelsius(tempObj) : processFahrenheit(tempObj)
    )
);
