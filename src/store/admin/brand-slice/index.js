import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  brandList: [],
};

export const addNewBrand = createAsyncThunk(
  "/brand/addNewBrand",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/brand/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

export const fetchAllBrands = createAsyncThunk(
  "/brand/fetchAllBrands",
  async () => {
    const result = await axios.get("http://localhost:5000/api/admin/brand/get");

    return result?.data;
  }
);

export const editBrand = createAsyncThunk(
  "/brand/editBrand",
  async ({ id, formData }) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/brand/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteBrand = createAsyncThunk(
  "/brand/deleteBrand",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/brand/delete/${id}`
    );

    return result?.data;
  }
);

const AdminBrandSilce = createSlice({
  name: "adminBrand",
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

export default AdminBrandSilce.reducer;
