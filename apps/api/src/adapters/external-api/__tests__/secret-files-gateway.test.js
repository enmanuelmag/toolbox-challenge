import { expect } from 'chai';

import { buildSecretFilesGateway } from '../secret-files-gateway.js';

describe('buildSecretFilesGateway', () => {
  it('lists files and URL-encodes file names on download', async () => {
    const requests = [];
    const gateway = buildSecretFilesGateway({
      baseUrl: 'https://example.test',
      authorization: 'Bearer test',
      fetchImpl: async (url, options) => {
        requests.push({ url, options });
        return url.endsWith('/files')
          ? { ok: true, json: async () => ({ files: ['a b.csv'] }) }
          : { ok: true, text: async () => 'csv-content' };
      },
    });

    expect(await gateway.listFiles()).to.deep.equal({
      ok: true,
      value: ['a b.csv'],
    });
    expect(await gateway.downloadFile('a b.csv')).to.deep.equal({
      ok: true,
      value: 'csv-content',
    });
    expect(requests[0].options.headers.authorization).to.equal('Bearer test');
    expect(requests[1].url).to.equal(
      'https://example.test/v1/secret/file/a%20b.csv',
    );
  });

  it('returns a safe external-service error on a failed request', async () => {
    const gateway = buildSecretFilesGateway({
      baseUrl: 'https://example.test',
      authorization: 'Bearer test',
      fetchImpl: async () => {
        throw new Error('network unavailable');
      },
    });

    expect(await gateway.listFiles()).to.deep.equal({
      ok: false,
      error: {
        code: 'EXTERNAL_SERVICE',
        message: 'Unable to retrieve file list',
      },
    });
  });
});
