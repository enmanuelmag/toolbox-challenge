import { parse } from 'csv-parse/sync';
import { ok, err } from '@toolbox/files-core';

const parseError = () => err('EXTERNAL_SERVICE', 'Unable to parse file');

export function buildCsvParser() {
  return {
    /**
     * Parses the provided CSV content and returns an array of records or an error if parsing fails.
     * @param {string} content - The CSV content to parse.
     * @returns {{ok: true, value: Array<Object>} | {ok: false, error: {code: string, message: string}}}
     */
    async parse(content) {
      if (typeof content !== 'string') return parseError();

      try {
        const records = parse(content, {
          skip_records_with_error: true,
          relax_column_count: true,
          skip_empty_lines: true,
          columns: true,
          trim: true,
        });

        return ok(records);
      } catch {
        return parseError();
      }
    },
  };
}
