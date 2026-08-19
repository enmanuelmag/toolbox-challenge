const HEX_32 = /^[0-9a-fA-F]{32}$/;

/**
 * Validates a record object and returns a validated record or null if invalid.
 * @param {Object} record - The record object to validate.
 * @returns {{text: string, hex: string, number: number} | null} - The validated record or null if invalid.
 */
export function validateRecord(record) {
  if (!record || typeof record !== 'object') {
    return null;
  }

  if (typeof record.file !== 'string' || record.file.length === 0) {
    return null;
  }

  if (typeof record.text !== 'string' || record.text.length === 0) {
    return null;
  }

  if (!HEX_32.test(record.hex || '')) {
    return null;
  }

  const number = Number(record.number);

  if (!Number.isFinite(number)) {
    return null;
  }

  return {
    text: record.text,
    hex: record.hex,
    number,
  };
}
