const PROPERTY_DECONSTRUCTION = /\]?\??\.\[?|\]?\[|\]/;
const PROPERTY_STRING_OR_ARRAY_DIGITS = /^(\"([^"]{1,1000})\")|(\d+)$/;
const removeWrappingDoubleQuites = str => str.replaceAll(/^"|"$/g, '');

export function lens(...props) {
  const _props = props
    .join('.')
    .split(PROPERTY_DECONSTRUCTION)
    .filter(item => item !== '');
  const reducer = (ob, pr) =>
    PROPERTY_STRING_OR_ARRAY_DIGITS.exec(pr)
      ? ob[removeWrappingDoubleQuites(pr)]
      : ob?.[pr];
  return obj => _props.reduce(reducer, obj);
}

export function lensFn(fn, ...props) {
  const propLens = lens(...props);
  return obj => {
    const prop = propLens(obj);
    if (undefined !== prop) {
      return fn(prop, obj);
    }
  };
}
