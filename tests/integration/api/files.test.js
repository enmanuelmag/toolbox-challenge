const request = require('supertest');
const { expect } = require('chai');

let buildApp;
let ok;
let err;

before(async () => {
  ({ buildApp } = await import('../../../apps/api/src/composition/build-app.js'));
  ({ ok, err } = await import('../../../packages/files-core/src/result.js'));
});

function createApp({ files = ['a.csv'], downloads = {}, records = {}, listResult } = {}) {
  const downloaded = [];
  const gatewayMock = {
    async listFiles() {
      return listResult || ok(files);
    },
    async downloadFile(fileName) {
      downloaded.push(fileName);
      return downloads[fileName] || ok(fileName);
    },
  };
  const csvParserMock = {
    async parse(content) {
      return records[content] || ok([]);
    },
  };

  return { app: buildApp({ gatewayMock, csvParserMock }), downloaded };
}

const validRecord = {
  file: 'a.csv',
  text: 'valid',
  number: '7',
  hex: 'c'.repeat(32),
};

describe('files API integration', () => {
  it('returns JSON data with valid records only', async () => {
    const { app } = createApp({
      records: {
        'a.csv': ok([validRecord, { ...validRecord, hex: 'invalid' }]),
      },
    });

    const response = await request(app).get('/files/data').expect(200);

    expect(response.headers['content-type']).to.match(/^application\/json/);
    expect(response.body).to.deep.equal({
      files: [
        {
          file: 'a.csv',
          lines: [{ text: 'valid', number: 7, hex: 'c'.repeat(32) }],
        },
      ],
    });
  });

  it('keeps an empty file and continues after a failed download', async () => {
    const { app } = createApp({
      files: ['failed.csv', 'empty.csv'],
      downloads: { 'failed.csv': err('EXTERNAL_SERVICE', 'download failed') },
    });

    const response = await request(app).get('/files/data').expect(200);

    expect(response.body).to.deep.equal({
      files: [{ file: 'empty.csv', lines: [] }],
    });
  });

  it('returns the optional list endpoint without transforming its external shape', async () => {
    const { app } = createApp({ files: ['a.csv', 'b.csv'] });

    const response = await request(app).get('/files/list').expect(200);

    expect(response.body).to.deep.equal({ files: ['a.csv', 'b.csv'] });
  });

  it('filters data to the requested file and rejects an empty filter', async () => {
    const { app, downloaded } = createApp({
      files: ['a.csv', 'b.csv'],
      records: { 'a.csv': ok([validRecord]) },
    });

    const response = await request(app)
      .get('/files/data?fileName=a.csv')
      .expect(200);

    expect(downloaded).to.deep.equal(['a.csv']);
    expect(response.body.files).to.have.length(1);
    expect(response.body.files[0].file).to.equal('a.csv');

    const invalidResponse = await request(app)
      .get('/files/data?fileName=')
      .expect(400);
    expect(invalidResponse.body).to.deep.equal({
      code: 'VALIDATION',
      message: 'fileName must be a non-empty string',
    });
  });

  it('returns a 502 JSON envelope when the external listing fails', async () => {
    const { app } = createApp({
      listResult: err('EXTERNAL_SERVICE', 'Unable to retrieve file list'),
    });

    const response = await request(app).get('/files/data').expect(502);

    expect(response.body).to.deep.equal({
      code: 'EXTERNAL_SERVICE',
      message: 'Unable to retrieve file list',
    });
  });
});
