import { configureStore } from '@reduxjs/toolkit';

import filesReducer from '../features/files/file-slice';

export const store = configureStore({
  reducer: {
    files: filesReducer,
  },
});
