import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  messageList: [],
};

export const addAdress = createAsyncThunk(
  "/footer/addAddress",
  async (formData) => {
    const result = await axios.post(
      "https://trendhive-server.onrender.com/api/admin/footer/add",
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
      "https://trendhive-server.onrender.com/api/admin/footer/get/info"
    );

    return result?.data;
  }
);

export const fetchAllMessages = createAsyncThunk(
  "/footer/fetchAllMessages",
  async () => {
    const result = await axios.get(
      "https://trendhive-server.onrender.com/api/admin/footer/get"
    );

    return result?.data;
  }
);

export const deleteMessage = createAsyncThunk(
  "/category/deleteMessage",
  async (id) => {
    const result = await axios.delete(
      `https://trendhive-server.onrender.com/api/admin/footer/delete/${id}`
    );

    return result?.data;
  }
);

const AdminFooterSlice = createSlice({
  name: "adminFooter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messageList = action.payload.data;
      })
      .addCase(fetchAllMessages.rejected, (state) => {
        state.isLoading = false;
        state.messageList = [];
      })
      .addCase(fetchAdminInfo.fulfilled, (state, action) => {
        state.adminInfo = action.payload?.data || {};
      });
  },
});

export default AdminFooterSlice.reducer;
