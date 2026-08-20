import { useEffect } from 'react';
import { Alert, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchFileNames,
  fetchFiles,
  selectFile,
} from '../features/files/files-slice';
import { FileSelector } from './FileSelector';
import { FilesTable } from './FilesTable';

export function FilesPage() {
  const dispatch = useDispatch();
  const { items, fileNames, fileName, status, error } = useSelector(
    (state) => state.files,
  );

  useEffect(() => {
    dispatch(fetchFileNames());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFiles(fileName));
  }, [dispatch, fileName]);

  let content;
  if (status === 'loading') {
    content = <Spinner animation="border" />;
  } else if (status === 'failed') {
    content = <Alert variant="danger">{error}</Alert>;
  } else if (items.length === 0) {
    content = <p>No files found.</p>;
  } else {
    content = <FilesTable items={items} />;
  }

  return (
    <Container className="py-4">
      <h1>Files</h1>

      <FileSelector
        fileNames={fileNames}
        value={fileName}
        onChange={(value) => dispatch(selectFile(value))}
      />

      {content}
    </Container>
  );
}
