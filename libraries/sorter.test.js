import { expect, jest, test } from '@jest/globals';

import { lens } from './lenses.js';

import sorter, { ASCENDING, DESCENDING } from './sorter.js';

import testCases from './sorter.json';

describe('sorter', () => {
  test('single numeric property (descending)', () => {
    const testData = testCases.map(rec => ({ ...rec, dob: new Date(rec.dob) }));
    const idLens = lens('id');

    testData.sort(
      sorter({
        lens: idLens,
        direction: DESCENDING,
      })
    );
    expect(testData).toEqual([
      { id: 10004, name: 'alpha', dob: new Date('2024-04-28T16:03:00.000Z') },
      { id: 10003, name: 'beta', dob: new Date('2024-04-28T16:02:00.000Z') },
      { id: 10002, name: 'alpha', dob: new Date('2024-04-28T16:01:00.000Z') },
      { id: 10001, name: 'beta', dob: new Date('2024-04-28T16:00:00.000Z') },
    ]);
  });

  test('single string property (ascending)', () => {
    const testData = testCases.map(rec => ({ ...rec, dob: new Date(rec.dob) }));
    const nameLens = lens('name');

    testData.sort(
      sorter({
        lens: nameLens,
        direction: DESCENDING,
      })
    );
    expect(testData).toEqual([
      { id: 10001, name: 'beta', dob: new Date('2024-04-28T16:00:00.000Z') },
      { id: 10003, name: 'beta', dob: new Date('2024-04-28T16:02:00.000Z') },
      { id: 10002, name: 'alpha', dob: new Date('2024-04-28T16:01:00.000Z') },
      { id: 10004, name: 'alpha', dob: new Date('2024-04-28T16:03:00.000Z') },
    ]);
  });

  test('dual property (name asc, id desc)', () => {
    const testData = testCases.map(rec => ({ ...rec, dob: new Date(rec.dob) }));
    const nameLens = lens('name');
    const idLens = lens('id');

    testData.sort(
      sorter(
        {
          lens: nameLens,
        },
        {
          lens: idLens,
          direction: DESCENDING,
        }
      )
    );
    expect(testData).toEqual([
      { id: 10004, name: 'alpha', dob: new Date('2024-04-28T16:03:00.000Z') },
      { id: 10002, name: 'alpha', dob: new Date('2024-04-28T16:01:00.000Z') },
      { id: 10003, name: 'beta', dob: new Date('2024-04-28T16:02:00.000Z') },
      { id: 10001, name: 'beta', dob: new Date('2024-04-28T16:00:00.000Z') },
    ]);
  });

  test('single adapted date property (desc)', () => {
    const testData = testCases.map(rec => ({ ...rec, dob: new Date(rec.dob) }));
    const dateLens = lens('dob');

    testData.sort(
      sorter({
        lens: dateLens,
        direction: DESCENDING,
        adaptor: dobDate => dobDate.valueOf(),
      })
    );
    expect(testData).toEqual([
      { id: 10004, name: 'alpha', dob: new Date('2024-04-28T16:03:00.000Z') },
      { id: 10003, name: 'beta', dob: new Date('2024-04-28T16:02:00.000Z') },
      { id: 10002, name: 'alpha', dob: new Date('2024-04-28T16:01:00.000Z') },
      { id: 10001, name: 'beta', dob: new Date('2024-04-28T16:00:00.000Z') },
    ]);
  });

  test('dual property (name asc, dob asc)', () => {
    const testData = testCases.map(rec => ({ ...rec, dob: new Date(rec.dob) }));
    const nameLens = lens('name');
    const dateLens = lens('dob');

    testData.sort(
      sorter(
        {
          lens: nameLens,
          direction: ASCENDING,
        },
        {
          lens: dateLens,
          adaptor: dobDate => dobDate.valueOf(),
        }
      )
    );
    expect(testData).toEqual([
      { id: 10002, name: 'alpha', dob: new Date('2024-04-28T16:01:00.000Z') },
      { id: 10004, name: 'alpha', dob: new Date('2024-04-28T16:03:00.000Z') },
      { id: 10001, name: 'beta', dob: new Date('2024-04-28T16:00:00.000Z') },
      { id: 10003, name: 'beta', dob: new Date('2024-04-28T16:02:00.000Z') },
    ]);
  });
});
