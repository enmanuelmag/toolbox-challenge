import { err, ok } from '../result.js';

import { validateRecord } from '../domain/validate-record.js';

/**
 * Builds a function to get files data using the provided gateway and CSV parser.
 * @param {Object} params - The parameters for building the function.
 * @param {Object} params.gateway - The gateway object with methods to list and download files.
 * @param {Object} params.csvParser - The CSV parser object with a parse method.
 * @returns {{ getFilesData: Function, listFiles: Function }} - An object containing the getFilesData and listFiles functions.
 */
export function buildFilesUseCases({ gateway, csvParser }) {
  /**
   * Retrieves files data based on the provided file name.
   * @param {Object} params - The parameters for retrieving files data.
   * @param {string} params.fileName - The name of the file to retrieve data for.
   * @returns {Promise<{ ok: true; value: Array<{ file: string; lines: Array<Object> }> } | { ok: false; error: string }>} - A promise that resolves to the retrieved files data.
   */
  return {
    async getFilesData({ fileName } = {}) {
      const listed = await gateway.listFiles();

      if (!listed.ok) {
        console.error('Error listing files:', listed.error);
        return err('list_files_failed', 'Failed to list files');
      }

      const names = fileName
        ? listed.value.filter((name) => name === fileName)
        : listed.value;

      const files = [];

      for (const file of names) {
        const downloaded = await gateway.downloadFile(file);

        if (!downloaded.ok) {
          console.error(`Error downloading file ${file}:`, downloaded.error);
          continue;
        }

        const parsed = await csvParser.parse(downloaded.value);

        if (!parsed.ok) {
          console.error(`Error parsing file ${file}:`, parsed.error);
          continue;
        }

        files.push({
          file,
          lines: parsed.value.map(validateRecord).filter(Boolean),
        });
      }

      return ok(files);
    },
    async listFiles() {
      const listed = await gateway.listFiles();

      if (!listed.ok) {
        console.error('Error listing files:', listed.error);
        return err('list_files_failed', 'Failed to list files');
      }

      return ok(listed.value);
    },
  };
}
