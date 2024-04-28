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

/*
function cascadedSort(_sortCriteria) {
	const type = {
		boolean: _ => `${_}`.toLowerCase() === 'false',
		date: _ => `${new Date(_).toISOString()}`,
		number: _ => +_,
		string: _ => _,
	};
	return _cascadedSort(..._sortCriteria);

	function _cascadedSort(_sortCriterion, ..._rest) {
		const columnLens = _sortCriterion.columnLens;
		const propertyType = type[_sortCriterion.type];
		const direction = _sortCriterion.sort.direction;

		return (objA, objB) => {
			const propertyA = propertyType(columnLens(objA));
			const propertyB = propertyType(columnLens(objB));
			const order =
				+(propertyA > propertyB) + -(propertyA < propertyB) ||
				(_rest.length ? _cascadedSort(..._rest)(objA, objB) : 0);
			return order * direction;
		};
	}
}
*/
