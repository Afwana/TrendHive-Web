import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  categoryList: [],
};

export const addNewCategory = createAsyncThunk(
  "/category/addNewCategory",
  async (formData) => {
    const result = await axios.post(
      "https://trendhive-server.onrender.com/api/admin/category/add",
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

export const fetchAllCategories = createAsyncThunk(
  "/category/fetchAllCategories",
  async () => {
    const result = await axios.get(
      "https://trendhive-server.onrender.com/api/admin/category/get"
    );

    return result?.data;
  }
);

export const editCategory = createAsyncThunk(
  "/category/editCategory",
  async ({ id, formData }) => {
    const result = await axios.put(
      `https://trendhive-server.onrender.com/api/admin/category/edit/${id}`,
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

export const deleteCategory = createAsyncThunk(
  "/category/deleteCategory",
  async (id) => {
    const result = await axios.delete(
      `https://trendhive-server.onrender.com/api/admin/category/delete/${id}`
    );

    return result?.data;
  }
);

const AdminCategorySilce = createSlice({
  name: "adminCategory",
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

export default AdminCategorySilce.reducer;
