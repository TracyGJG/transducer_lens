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

const inputData = ['0°C', 'Invalid String', '-40°F', '-273.15K', '100°C'];

// ==========================================================

const validTemperatures = inputData.filter(isTemperatureString);
console.log(validTemperatures);

const invalidTemperatures = inputData.filter(
  temp => !isTemperatureString(temp)
);
console.log(invalidTemperatures);

const temperatureSimpleObjects = validTemperatures.map(convertIntoObject);
console.table(temperatureSimpleObjects);

const temperatureComplexObjects = temperatureSimpleObjects.map(tempObj =>
  isCelsius(tempObj) ? processCelsius(tempObj) : processFahrenheit(tempObj)
);
console.table(temperatureComplexObjects);
