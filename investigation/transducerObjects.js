import { range } from './utils.js';
import { lensFn } from './lenses.js';
import { composeTransducers, filter, mapper } from './transducer.js';

// ==========================================================

// generate input data
const objs = range(200, 10, 10).map((num, idx) => ({
  uuid: `uuid_${idx + 1}`,
  val: num,
  bools: {
    isEven: !!(num % 2),
    isOdd: !(num % 2),
  },
  tm: Date.now() + 60_000 * idx,
}));

// ==========================================================

// transforms
const tmToIso = tm => new Date(tm).toISOString();
const tmToIsoLens = lensFn(tmToIso, 'tm');
const createNewObject = ({ uuid, val, tm }) => ({
  uuid,
  val,
  tm,
  tmIso: tmToIsoLens({ tm }),
});

// predicates
const valGreaterThan100Lens = lensFn(_val => _val > 100, 'val');

// ==========================================================

const transducer = composeTransducers(
  filter(valGreaterThan100Lens),
  mapper(createNewObject)
);

// ==========================================================

console.log('\ninput array:');
console.table(objs);

console.log('\ntransducedArray:');
console.table(transducer(objs));
