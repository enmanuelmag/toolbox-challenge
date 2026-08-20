import { expect } from 'chai';

import { buildCsvParser } from '../csv-parser.js';

describe('buildCsvParser', () => {
  it('returns records for valid CSV and an empty list for an empty file', async () => {
    const parser = buildCsvParser();

    expect(
      await parser.parse(
        `file,text,number,hex\na.csv,hello,7,${'a'.repeat(32)}\n`,
      ),
    ).to.deep.equal({
      ok: true,
      value: [
        { file: 'a.csv', text: 'hello', number: '7', hex: 'a'.repeat(32) },
      ],
    });
    expect(await parser.parse('')).to.deep.equal({ ok: true, value: [] });
  });

  it('tolerates incomplete rows for domain validation and rejects non-strings', async () => {
    const parser = buildCsvParser();

    const result = await parser.parse('file,text,number,hex\na.csv,hello\n');

    expect(result.ok).to.equal(true);
    expect(result.value).to.have.length(1);
    expect(await parser.parse(null)).to.deep.equal({
      ok: false,
      error: { code: 'EXTERNAL_SERVICE', message: 'Unable to parse file' },
    });
  });
});
