import { FilesPage } from './components/FilesPage';

import { Container, Tex } from 'react-bootstrap';

export function App() {
  return (
    <Container className="App">
      <h1>File Viewer</h1>

      <FilesPage />
    </Container>
  );
}
