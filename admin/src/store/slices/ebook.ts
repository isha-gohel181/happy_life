import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
      const response = await axiosInstance.delete(`/ebooks/${id}`);
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
