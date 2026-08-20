import { render, screen } from '@testing-library/react';

import { FilesTable } from '../FilesTable';

describe('FilesTable', () => {
  it('renders the requested columns and every file line', () => {
    render(
      <FilesTable
        items={[
          {
            file: 'a.csv',
            lines: [{ text: 'hello', number: 7, hex: 'a'.repeat(32) }],
          },
        ]}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'File Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Text' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Number' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Hex' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'a.csv' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'hello' })).toBeInTheDocument();
  });
});
