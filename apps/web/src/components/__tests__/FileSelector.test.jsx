import { fireEvent, render, screen } from '@testing-library/react';

import { FileSelector } from '../FileSelector';

describe('FileSelector', () => {
  it('shows all file names and emits the selected name', () => {
    const onChange = jest.fn();

    render(
      <FileSelector
        fileNames={['a.csv', 'b.csv']}
        value=""
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'b.csv' },
    });

    expect(screen.getByRole('option', { name: 'Todos los archivos' })).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith('b.csv');
  });
});
