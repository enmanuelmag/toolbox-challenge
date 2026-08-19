/**
 *
 * @param {any} value
 * @returns {{ok: true, value: any}}
 */
export const ok = (value) => {
  return { ok: true, value };
};

/**
 *
 * @param {string} code
 * @param {string} message
 * @returns {{ok: false, error: {code: string, message: string}}}
 */
export const err = (code, message) => {
  return { ok: false, error: { code, message } };
};
