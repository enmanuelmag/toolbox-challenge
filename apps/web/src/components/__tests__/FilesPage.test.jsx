import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import { FilesPage } from '../FilesPage';
import filesReducer from '../../features/files/file-slice';

function renderPage() {
  const store = configureStore({ reducer: { files: filesReducer } });
  return render(
    <Provider store={store}>
      <FilesPage />
    </Provider>,
  );
}

function successfulFetch(data = [{ file: 'a.csv', lines: [] }]) {
  return jest.fn((url) =>
    Promise.resolve({
      ok: true,
      json: async () =>
        url === '/api/files/list' ? { files: ['a.csv'] } : { files: data },
    }),
  );
}

describe('FilesPage', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows a spinner while the initial requests are pending', () => {
    global.fetch = jest.fn(() => new Promise(() => {}));

    renderPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows an error alert when a request fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 500 }));

    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /failed|request/i,
    );
  });

  it('shows an empty-state message after successful empty data', async () => {
    global.fetch = successfulFetch([]);

    renderPage();

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    expect(screen.getByText('No files found.')).toBeInTheDocument();
  });

  it('renders returned rows and reloads with the selected file filter', async () => {
    global.fetch = successfulFetch([
      {
        file: 'a.csv',
        lines: [{ text: 'hello', number: 9, hex: 'a'.repeat(32) }],
      },
    ]);

    renderPage();

    expect(await screen.findByText('hello')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'a.csv' },
    });

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/files/data?fileName=a.csv',
      ),
    );
  });
});
