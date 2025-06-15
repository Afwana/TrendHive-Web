import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  messageList: [],
};

export const addMessages = createAsyncThunk(
  "/footer/addMessages",
  async (formData) => {
    const result = await axios.post(
      "https://trendhive-server.onrender.com/api/shop/footer/add",
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

export const fetchAdminInfo = createAsyncThunk(
  "/footer/fetchAdminInfo",
  async () => {
    const result = await axios.get(
      "https://trendhive-server.onrender.com/api/shop/footer/get"
    );

    return result?.data;
  }
);

export const fetchUserMessages = createAsyncThunk(
  "/footer/fetchUserMessages",
  async (id) => {
    const result = await axios.get(
      `https://trendhive-server.onrender.com/api/shop/footer/get/${id}`
    );

    return result?.data;
  }
);

export const fetchMediaLinks = createAsyncThunk(
  "/footer/getMediaLinks",
  async () => {
    const result = await axios.get(
      `https://trendhive-server.onrender.com/api/shop/footer/getMediaLinks`
    );

    return result?.data;
  }
);

const ShopFooterSlice = createSlice({
  name: "shopFooter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messageList = action.payload.data;
      })
      .addCase(fetchUserMessages.rejected, (state) => {
        state.isLoading = false;
        state.messageList = [];
      })
      .addCase(fetchMediaLinks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMediaLinks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mediaLinks = action.payload.data;
      })
      .addCase(fetchMediaLinks.rejected, (state) => {
        state.isLoading = false;
        state.mediaLinks = [];
      });
  },
});

export default ShopFooterSlice.reducer;
