import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';

import { store } from './store/index.js';

import { App } from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root,
);
