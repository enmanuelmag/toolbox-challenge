import express from 'express';

import { buildFilesUseCases, err, ok } from '@toolbox/files-core';

import { buildCsvParser } from '../adapters/external-api/csv-parser.js';
import { buildSecretFilesGateway } from '../adapters/external-api/secret-files-gateway.js';

import { externalService } from '../config/external-service.js';
import { sendResult } from '../adapters/http/result-to-http.js';

function readFileName(query) {
  if (!Object.prototype.hasOwnProperty.call(query, 'fileName')) {
    return { ok: true, value: undefined };
  }

  const { fileName } = query;
  if (typeof fileName !== 'string' || fileName.trim().length === 0) {
    return err('VALIDATION', 'fileName must be a non-empty string');
  }

  return ok(fileName.trim());
}

export function buildApp({ gatewayMock, csvParserMock } = {}) {
  const gateway = gatewayMock ?? buildSecretFilesGateway(externalService);

  const csvParser = csvParserMock ?? buildCsvParser();

  const filesUseCases = buildFilesUseCases({
    gateway,
    csvParser,
  });

  const app = express();

  app.get('/health', (_req, res) => {
    res.status(200).json(ok('OK'));
  });

  app.get('/files/list', async (_req, res) => {
    console.log('Received request for /files/list');

    sendResult(res, await filesUseCases.listFiles());
  });

  app.get('/files/data', async (req, res) => {
    console.log('Received request for /files/data with query:', req.query);
    const fileName = readFileName(req.query);

    if (!fileName.ok) {
      console.error('Error reading fileName from query:', fileName.error);
      return sendResult(res, fileName);
    }

    console.log('Fetching files data for fileName:', fileName.value);

    sendResult(
      res,
      await filesUseCases.getFilesData({ fileName: fileName.value }),
    );
  });

  return app;
}
