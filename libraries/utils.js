export function append(arr, ...item) {
  const _append = _item => (arr.push(_item), arr);
  return item.length ? _append(item[0]) : _append;
}

export function compose(...funcs) {
  return x => funcs.reduceRight((x, f) => f(x), x);
}

export function logger(name, func = _ => _) {
  return x => {
    const y = func(x);
    console.log(`\t${name}: ${JSON.stringify(x)} => ${JSON.stringify(y)}`);
    return y;
  };
}

export function range(max, min = 0, step = 1) {
  return Array.from({ length: max }, (_, i) => min + i * step);
}
