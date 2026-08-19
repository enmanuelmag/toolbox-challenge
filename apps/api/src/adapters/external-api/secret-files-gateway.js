import fetch from 'node-fetch';
import { ok, err } from '@toolbox/files-core';

const externalError = (message) => err('EXTERNAL_SERVICE', message);

export function buildSecretFilesGateway({
  baseUrl,
  authorization,
  timeoutMs,
  fetchImpl = fetch,
}) {
  async function request(path, errorMessage) {
    const controller = new AbortController();

    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(`${baseUrl}${path}`, {
        headers: {
          accept: 'application/json',
          authorization,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        return externalError(errorMessage);
      }

      return ok(response);
    } catch {
      return externalError(errorMessage);
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    /**
     * Lists the available secret files.
     * @returns {{ok: true, value: Array<string>} | {ok: false, error: {code: string, message: string}}}
     */
    async listFiles() {
      const result = await request(
        '/v1/secret/files',
        'Unable to retrieve file list',
      );

      if (!result.ok) {
        return result;
      }

      try {
        const body = await result.value.json();

        if (
          !body ||
          !Array.isArray(body.files) ||
          !body.files.every(
            (file) => typeof file === 'string' && file.length > 0,
          )
        ) {
          return externalError('Unable to retrieve file list');
        }

        return ok(body.files);
      } catch {
        return externalError('Unable to retrieve file list');
      }
    },

    /**
     * Downloads a secret file by its name.
     * @param {string} fileName - The name of the file to download.
     * @returns {{ok: true, value: string} | {ok: false, error: {code: string, message: string}}}
     */
    async downloadFile(fileName) {
      if (typeof fileName !== 'string' || fileName.length === 0) {
        return err('VALIDATION', 'fileName is required');
      }

      const result = await request(
        `/v1/secret/file/${encodeURIComponent(fileName)}`,
        'Unable to retrieve file',
      );
      if (!result.ok) return result;

      try {
        return ok(await result.value.text());
      } catch {
        return externalError('Unable to retrieve file');
      }
    },
  };
}
