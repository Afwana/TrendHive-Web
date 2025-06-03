/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await axios.post(
      "https://trendhive-server.onrender.com/api/auth/register",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await axios.post(
      "https://trendhive-server.onrender.com/api/auth/login",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      "https://trendhive-server.onrender.com/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // First try with cookies
      const res = await axios.get(
        "https://trendhive-server.onrender.com/api/auth/check-auth",
        {
          withCredentials: true,
        }
      );

      // If successful, return data
      if (res.data.success) {
        return res.data;
      }

      const token = localStorage.getItem("authToken");
      if (token) {
        const fallbackRes = await axios.get(
          "https://trendhive-server.onrender.com/api/auth/check-auth",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return fallbackRes.data;
      }

      // If both methods fail
      return rejectWithValue("Not authenticated");
    } catch (err) {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const fallbackRes = await axios.get(
            "https://trendhive-server.onrender.com/api/auth/check-auth",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return fallbackRes.data;
        } catch (fallbackError) {
          return rejectWithValue(fallbackError.response?.data);
        }
      }
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          localStorage.setItem("authToken", action.payload.token);
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          if (action.payload.token) {
            localStorage.setItem("authToken", action.payload.token);
          }
        } else {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("authToken");
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        const token = localStorage.getItem("authToken");
        if (token) {
          state.isAuthenticated = false;
          state.user = null;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        localStorage.removeItem("authToken");
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
