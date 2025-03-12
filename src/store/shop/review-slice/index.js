import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  userReviews: [],
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata) => {
    const response = await axios.post(
      `https://trendhive-server.onrender.com/api/shop/review/add`,
      formdata
    );

    return response.data;
  }
);

export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
  const response = await axios.get(
    `https://trendhive-server.onrender.com/api/shop/review/${id}`
  );

  return response.data;
});

export const getUserReviews = createAsyncThunk(
  "/order/getUserReviews",
  async (id) => {
    const response = await axios.get(
      `https://trendhive-server.onrender.com/api/shop/review/user/${id}`
    );

    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })
      .addCase(getUserReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userReviews = action.payload.data;
      })
      .addCase(getUserReviews.rejected, (state) => {
        state.isLoading = false;
        state.userReviews = [];
      });
  },
});

export default reviewSlice.reducer;
