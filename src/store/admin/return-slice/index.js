import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  returnList: [],
};

export const fetchAllReturnRequests = createAsyncThunk(
  "/return/fetchAllReturnRequests",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/return/get`
    );

    return response.data;
  }
);

export const updateReturnStatus = createAsyncThunk(
  "/return/updateReturnStatus",
  async ({ id, status }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/return/update/${id}`,
      {
        status,
      }
    );

    return response.data;
  }
);

export const deleteReturnRequest = createAsyncThunk(
  "/return/deleteReturnRequest",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/return/delete/${id}`
    );

    return result?.data;
  }
);

const adminReturnSlice = createSlice({
  name: "adminReturnSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReturnRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllReturnRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.returnList = action.payload.data;
      })
      .addCase(fetchAllReturnRequests.rejected, (state) => {
        state.isLoading = false;
        state.returnList = [];
      });
  },
});

export default adminReturnSlice.reducer;
