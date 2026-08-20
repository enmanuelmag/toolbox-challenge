/**
 * FileSelector component allows users to select a file from a dropdown list.
 *
 * @param {Object} props - The component props.
 * @param {Array<string>} props.fileNames - An array of file names to display in the dropdown.
 * @param {string} props.value - The currently selected file name.
 * @param {Function} props.onChange - A callback function to handle changes in the selected file name.
 * @returns {JSX.Element} - The rendered FileSelector component.
 */
export function FileSelector({ fileNames, value, onChange }) {
  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      defaultValue="all"
    >
      <option value="all">Todos los archivos</option>

      {fileNames.map((fileName) => (
        <option key={fileName} value={fileName}>
          {fileName}
        </option>
      ))}
    </select>
  );
}
