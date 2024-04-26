// predicates
export const isTruthy = Boolean;
export const isTemperatureString = inputString =>
  /^-?\d{1,4}(\.\d\d?)?°[CF]$/.exec(inputString);
export const isCelsius = objTemperature => objTemperature.unit === 'C';

// transforms
export const convertIntoObject = validString => {
  const [numeric, unit] = validString.split(/°/);
  return {
    numeric,
    unit,
  };
};
export const processCelsius = ({ numeric }) => ({
  celsius: +numeric,
  fahrenheit: (+numeric / 5) * 9 + 32,
});
export const processFahrenheit = ({ numeric }) => ({
  celsius: ((+numeric - 32) / 9) * 5,
  fahrenheit: +numeric,
});
