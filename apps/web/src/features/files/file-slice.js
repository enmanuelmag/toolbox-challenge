import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchFileNames = createAsyncThunk(
  'files/fetchFileNames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/files/list');

      if (!response.ok) {
        return rejectWithValue('Failed to fetch file names');
      }

      const body = await response.json();

      return Array.isArray(body?.files) ? body.files : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchFileData = createAsyncThunk(
  'files/fetchFileData',
  async (fileName, { rejectWithValue }) => {
    try {
      const query = fileName ? `?fileName=${encodeURIComponent(fileName)}` : '';

      const response = await fetch(`/api/files/data${query}`);

      if (!response.ok) {
        return rejectWithValue(`Request failed with status ${response.status}`);
      }

      const body = await response.json();

      return Array.isArray(body?.files) ? body.files : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    items: [],
    fileNames: [],
    fileName: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    selectFile(state, action) {
      state.fileName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchFileNames actions
      .addCase(fetchFileNames.fulfilled, (state, action) => {
        state.fileNames = action.payload;
      })
      .addCase(fetchFileNames.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFileNames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load file names';
      })
      // Handle fetchFileData actions
      .addCase(fetchFileData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFileData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFileData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load file data';
      });
  },
});

export const { selectFile } = filesSlice.actions;

export default filesSlice.reducer;
