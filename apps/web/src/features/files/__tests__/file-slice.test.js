import { configureStore } from '@reduxjs/toolkit';

import filesReducer, {
  fetchFileData,
  fetchFileNames,
  selectFile,
} from '../file-slice';

function createStore() {
  return configureStore({ reducer: { files: filesReducer } });
}

describe('files slice', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('stores the selected file', () => {
    const state = filesReducer(undefined, selectFile('a file.csv'));

    expect(state.fileName).toBe('a file.csv');
  });

  it('loads the external-shaped file list and data filter URL', async () => {
    global.fetch = jest.fn((url) =>
      Promise.resolve({
        ok: true,
        json: async () =>
          url === '/api/files/list'
            ? { files: ['a.csv'] }
            : { files: [{ file: 'a.csv', lines: [] }] },
      }),
    );
    const store = createStore();

    await store.dispatch(fetchFileNames());
    await store.dispatch(fetchFileData('a file.csv'));

    expect(global.fetch).toHaveBeenNthCalledWith(1, '/api/files/list');
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      '/api/files/data?fileName=a%20file.csv',
    );
    expect(store.getState().files.fileNames).toEqual(['a.csv']);
    expect(store.getState().files.items).toEqual([
      { file: 'a.csv', lines: [] },
    ]);
  });

  it('stores a useful error when the data request fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 503 }));
    const store = createStore();

    await store.dispatch(fetchFileData('a.csv'));

    expect(store.getState().files).toMatchObject({
      status: 'failed',
      error: 'Request failed with status 503',
    });
  });
});
