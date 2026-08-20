import { expect } from 'chai';

import { validateRecord } from '../validate-record.js';

const validRecord = {
  file: 'file1.csv',
  text: 'hello',
  number: '0',
  hex: 'a'.repeat(32),
};

describe('validateRecord', () => {
  it('normalizes a valid record and preserves zero as a number', () => {
    expect(validateRecord(validRecord)).to.deep.equal({
      text: 'hello',
      number: 0,
      hex: 'a'.repeat(32),
    });
  });

  it('discards records with missing required fields or invalid values', () => {
    expect(validateRecord()).to.equal(null);
    expect(validateRecord({ ...validRecord, text: '' })).to.equal(null);
    expect(validateRecord({ ...validRecord, number: 'not-a-number' })).to.equal(
      null,
    );
    expect(validateRecord({ ...validRecord, hex: 'abc' })).to.equal(null);
  });
});
