import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  brandList: [],
};

export const fetchAllBrands = createAsyncThunk(
  "/brand/fetchAllBrands",
  async () => {
    const result = await axios.get("http://localhost:5000/api/shop/brand/get");

    return result?.data;
  }
);

const ShopBrandSilce = createSlice({
  name: "shopBrand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandList = action.payload.data;
      })
      .addCase(fetchAllBrands.rejected, (state) => {
        state.isLoading = false;
        state.brandList = [];
      });
  },
});

export default ShopBrandSilce.reducer;
