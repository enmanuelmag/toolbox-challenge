import { useEffect } from 'react';
import { Alert, Container, Spinner, Stack } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchFileData,
  fetchFileNames,
  selectFile,
} from '../features/files/file-slice';
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
    dispatch(fetchFileData(fileName));
  }, [dispatch, fileName]);

  let content;

  if (status === 'loading') {
    content = (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  } else if (status === 'failed') {
    content = <Alert variant="danger">{error}</Alert>;
  } else if (items.length === 0) {
    content = <p>No files found.</p>;
  } else if (fileName !== '' && items?.at(0)?.lines?.length === 0) {
    content = <p>No data found for the selected file.</p>;
  } else {
    content = <FilesTable items={items} />;
  }

  return (
    <Container className="py-4">
      <Stack gap={3}>
        <FileSelector
          fileNames={fileNames}
          value={fileName}
          onChange={(value) => dispatch(selectFile(value))}
        />

        {content}
      </Stack>
    </Container>
  );
}
