export function statusForError(error) {
  if (error.code === 'VALIDATION') {
    return 400;
  }
  if (error.code === 'EXTERNAL_SERVICE') {
    return 502;
  }

  return 500;
}

/**
 * Sends the result of an operation as an HTTP response.
 */
export function sendResult(res, result) {
  return result.ok
    ? res.status(200).json(result.value)
    : res.status(statusForError(result.error)).json(result.error);
}
