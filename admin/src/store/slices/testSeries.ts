import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
      const response = await axiosInstance.get("/test-series/admin/list");
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
      const response = await axiosInstance.delete(`/test-series/${id}`);
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
