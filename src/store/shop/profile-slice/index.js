import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  error: null,
  success: false,
};

export const updateUserProfile = createAsyncThunk(
  "/shop/updateProfile",

  async (formData) => {
    const response = await axios.put(
      "https://trendhive-server.onrender.com/api/shop/profile",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const updateUserPassword = createAsyncThunk(
  "shop/updatePassword",
  async (formData) => {
    const response = await axios.put(
      "https://trendhive-server.onrender.com/api/shop/password",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const shopSlice = createSlice({
  name: "shopProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.success;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.success;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default shopSlice.reducer;
