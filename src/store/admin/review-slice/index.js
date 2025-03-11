import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  reviewList: [],
};

export const getAllReviewsForAdmin = createAsyncThunk(
  "/review/getAllReviewsForAdmin",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/review/get`
    );

    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  "/review/deleteReview",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/review/delete/${id}`
    );

    return result?.data;
  }
);

const adminReviewSlice = createSlice({
  name: "adminReviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviewsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviewsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviewList = action.payload.data;
      })
      .addCase(getAllReviewsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.reviewList = [];
      });
  },
});

export default adminReviewSlice.reducer;
