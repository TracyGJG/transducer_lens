export const ASCENDING = 1;
export const DESCENDING = -1;

export default function sorter(
  { lens, direction = ASCENDING, adaptor = _ => _ },
  ...criteria
) {
  return function comparator(objA, objB) {
    const propertyA = adaptor(lens(objA));
    const propertyB = adaptor(lens(objB));
    return (
      direction * (+(propertyA > propertyB) + -(propertyA < propertyB)) ||
      (criteria.length ? sorter(...criteria)(objA, objB) : 0)
    );
  };
}
