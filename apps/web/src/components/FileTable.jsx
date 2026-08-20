/**
 * FileTable component displays a table of files with their names and contents.
 *
 * @param {Object} props - The component props.
 * @param {Array<{ text: string, hex: string, number: number }>} props.items - An array of file records to display in the table.
 * @returns {JSX.Element} - The rendered FileTable component.
 */
export function FileTable({ items }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Text</th>
          <th>Hex</th>
          <th>Number</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.text}</td>
            <td>{item.hex}</td>
            <td>{item.number}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
