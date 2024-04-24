export function append(arr, ...items) {
  const _append = (..._items) => (arr.push(..._items), arr);
  return items.length ? _append(...items) : _append;
}

export function compose(...funcs) {
  return x => funcs.reduceRight((x, f) => f(x), x);
}

export function logger(name, func = val => val) {
  return x => {
    const y = func(x);
    console.log(
      `\t${name}: ${JSON.stringify(x)} \n\t\t=> ${JSON.stringify(y)}`
    );
    return y;
  };
}

export function range(max, min = 0, step = 1) {
  return Array.from({ length: max }, (_, i) => min + i * step);
}
