import { expect } from 'chai';

import { buildFilesUseCases } from '../get-files-data.js';
import { err, ok } from '../../result.js';

const validRecord = {
  file: 'ignored.csv',
  text: 'valid',
  number: '42',
  hex: 'b'.repeat(32),
};

describe('buildFilesUseCases', () => {
  it('filters by name, skips invalid rows, and never downloads another file', async () => {
    const downloads = [];
    const useCases = buildFilesUseCases({
      gateway: {
        async listFiles() {
          return ok(['a.csv', 'b.csv']);
        },
        async downloadFile(fileName) {
          downloads.push(fileName);
          return ok('a-content');
        },
      },
      csvParser: {
        async parse() {
          return ok([validRecord, { ...validRecord, hex: 'short' }]);
        },
      },
    });

    const result = await useCases.getFilesData({ fileName: 'a.csv' });

    expect(downloads).to.deep.equal(['a.csv']);
    expect(result).to.deep.equal(
      ok({
        files: [
          {
            file: 'a.csv',
            lines: [
              { text: 'valid', number: 42, hex: 'b'.repeat(32) },
            ],
          },
        ],
      }),
    );
  });

  it('keeps empty files and continues after a failed download', async () => {
    const useCases = buildFilesUseCases({
      gateway: {
        async listFiles() {
          return ok(['failed.csv', 'empty.csv']);
        },
        async downloadFile(fileName) {
          return fileName === 'failed.csv'
            ? err('EXTERNAL_SERVICE', 'download failed')
            : ok('empty-content');
        },
      },
      csvParser: {
        async parse() {
          return ok([]);
        },
      },
    });

    const result = await useCases.getFilesData();

    expect(result).to.deep.equal(
      ok({ files: [{ file: 'empty.csv', lines: [] }] }),
    );
  });

  it('propagates a listing failure and exposes the optional list envelope', async () => {
    const listFailure = err('EXTERNAL_SERVICE', 'list failed');
    const failedUseCases = buildFilesUseCases({
      gateway: { async listFiles() { return listFailure; } },
      csvParser: { async parse() { return ok([]); } },
    });
    const listedUseCases = buildFilesUseCases({
      gateway: { async listFiles() { return ok(['a.csv']); } },
      csvParser: { async parse() { return ok([]); } },
    });

    expect(await failedUseCases.getFilesData()).to.deep.equal(listFailure);
    expect(await listedUseCases.listFiles()).to.deep.equal(
      ok({ files: ['a.csv'] }),
    );
  });
});
