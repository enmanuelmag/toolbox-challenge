import { buildApp } from './composition/build-app.js';

buildApp()
  .listen(3000)
  .addListener('listening', () => {
    console.log('Server is running on port 3000');
  });
