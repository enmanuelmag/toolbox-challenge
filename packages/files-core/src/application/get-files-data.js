import { err, ok } from '../result.js';

import { validateRecord } from '../domain/validate-record.js';

/**
 * Builds a function to get files data using the provided gateway and CSV parser.
 * @param {Object} params - The parameters for building the function.
 * @param {Object} params.gateway - The gateway object with methods to list and download files.
 * @param {Object} params.csvParser - The CSV parser object with a parse method.
 * @returns {Function} - A function that retrieves files data based on the provided file name.
 */
export function buildGetFilesData({ gateway, csvParser }) {
  /**
   * Retrieves files data based on the provided file name.
   * @param {Object} params - The parameters for retrieving files data.
   * @param {string} params.fileName - The name of the file to retrieve data for.
   * @returns {Promise<{ ok: true; value: Array<{ file: string; lines: Array<Object> }> } | { ok: false; error: string }>} - A promise that resolves to the retrieved files data.
   */
  return async function getFilesData({ fileName } = {}) {
    const listed = await gateway.listFiles();

    if (!listed.ok) {
      return err('list_files_failed', 'Failed to list files');
    }

    const names = fileName
      ? listed.value.filter((name) => name === fileName)
      : listed.value;

    const files = [];

    for (const file of names) {
      const downloaded = await gateway.downloadFile(file);

      if (!downloaded.ok) {
        continue;
      }

      const parsed = await csvParser.parse(downloaded.value);

      if (!parsed.ok) {
        continue;
      }

      files.push({
        file,
        lines: parsed.value.map(validateRecord).filter(Boolean),
      });
    }

    return ok(files);
  };
}
