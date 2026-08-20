import { FilesPage } from './components/FilePage';

import { Container, Tex } from 'react-bootstrap';

export function App() {
  return (
    <Container className="App">
      <h1>File Viewer</h1>
      <FilesPage />
    </Container>
  );
}
