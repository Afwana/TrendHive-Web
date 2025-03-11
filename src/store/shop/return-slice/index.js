import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  returnDetails: null,
};

export const createReturnOrder = createAsyncThunk(
  "/return/createReturnOrder",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/return/request",
      formData
    );

    return response.data;
  }
);

const shoppingReturnSlice = createSlice({
  name: "shoppingReturnSlice",
  initialState,
  reducers: {
    resetReturnDetails: (state) => {
      state.returnDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReturnOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReturnOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createReturnOrder.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetReturnDetails } = shoppingReturnSlice.actions;

export default shoppingReturnSlice.reducer;
