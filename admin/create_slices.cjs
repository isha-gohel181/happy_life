const fs = require('fs');
const path = require('path');

const ADMIN_DIR = 'd:/prasad/AndroidStudioProjects/os_academy_lms/admin';
const SLICES_DIR = path.join(ADMIN_DIR, 'src', 'store', 'slices');
const STORE_FILE = path.join(ADMIN_DIR, 'src', 'store', 'index.ts');

const test_series_slice = `import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

interface TestSeriesState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: TestSeriesState = {
  loading: false,
  error: null,
  data: null,
};

export const fetchTestSeries = createAsyncThunk(
  "testSeries/fetchTestSeries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/test-series");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteTestSeries = createAsyncThunk(
  "testSeries/deleteTestSeries",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(\`/test-series/\${id}\`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const testSeriesSlice = createSlice({
  name: "testSeries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestSeries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestSeries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTestSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default testSeriesSlice.reducer;
`;

const ebook_slice = `import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

interface EbookState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: EbookState = {
  loading: false,
  error: null,
  data: null,
};

export const fetchEbooks = createAsyncThunk(
  "ebook/fetchEbooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/ebooks");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteEbook = createAsyncThunk(
  "ebook/deleteEbook",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(\`/ebooks/\${id}\`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const ebookSlice = createSlice({
  name: "ebook",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEbooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEbooks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEbooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ebookSlice.reducer;
`;

fs.writeFileSync(path.join(SLICES_DIR, 'testSeries.ts'), test_series_slice);
fs.writeFileSync(path.join(SLICES_DIR, 'ebook.ts'), ebook_slice);

let content = fs.readFileSync(STORE_FILE, 'utf-8');
if (!content.includes('import testSeries from')) {
    content = content.replace('import zoomReducer from "./slices/zoomSlice";', 'import zoomReducer from "./slices/zoomSlice";\\nimport testSeries from "./slices/testSeries";\\nimport ebook from "./slices/ebook";');
    content = content.replace('zoom: zoomReducer', 'zoom: zoomReducer,\\n    testSeries: testSeries,\\n    ebook: ebook');
    fs.writeFileSync(STORE_FILE, content);
}

console.log("Generated slices and updated store.ts");
