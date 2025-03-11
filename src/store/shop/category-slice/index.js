import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  categoryList: [],
};

export const fetchAllCategories = createAsyncThunk(
  "/category/fetchAllCategories",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/shop/category/get"
    );

    return result?.data;
  }
);

const ShopCategorySilce = createSlice({
  name: "shopCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload.data;
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        state.isLoading = false;
        state.categoryList = [];
      });
  },
});

export default ShopCategorySilce.reducer;
