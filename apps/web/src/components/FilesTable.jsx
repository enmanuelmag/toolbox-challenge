import { Table } from 'react-bootstrap';

/**
 * FileTable component displays a table of files with their names and contents.
 *
 * @param {Object} props - The component props.
 * @param {Array<{ file: string, lines: { text: string, hex: string, number: number }[] }>} props.items - An array of file records to display in the table.
 * @returns {JSX.Element} - The rendered FileTable component.
 */
export function FilesTable({ items }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </tr>
      </thead>
      <tbody>
        {items.map((file, index) =>
          file.lines.map((line, lineIndex) => (
            <tr key={`${index}-${lineIndex}`}>
              <td>{file.file}</td>
              <td>{line.text}</td>
              <td>{line.number}</td>
              <td>{line.hex}</td>
            </tr>
          )),
        )}
      </tbody>
    </Table>
  );
}
