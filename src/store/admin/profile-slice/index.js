import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  error: null,
  success: false,
};

export const updateAdminProfile = createAsyncThunk(
  "/admin/updateProfile",

  async (formData) => {
    const response = await axios.put(
      "https://trendhive-server.onrender.com/api/admin/profile",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const updateAdminPassword = createAsyncThunk(
  "admin/updatePassword",
  async (formData) => {
    const response = await axios.put(
      "https://trendhive-server.onrender.com/api/admin/password",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const adminSlice = createSlice({
  name: "adminProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateAdminProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.success;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateAdminPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAdminPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.success;
      })
      .addCase(updateAdminPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default adminSlice.reducer;
