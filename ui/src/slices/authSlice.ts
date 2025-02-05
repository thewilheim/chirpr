import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "../config/applicatonConfig";
import axios from "axios"; // For making API calls
import { BASE_URL, USERS_URL } from "../constrants";

// Load token from localStorage on startup
const loadTokenFromStorage = () => localStorage.getItem("userToken") || null;

// Async thunk to fetch user details using token
export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as { auth: { userToken: string | null } };
    if (!auth.userToken) return rejectWithValue("No token found");

    const response = await axios.get(`${BASE_URL}${USERS_URL}/profile`, {
      headers: { Authorization: `Bearer ${auth.userToken}` },
    });
    return response.data; // The user data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch user");
  }
});

const initialState: { userInfo: IUser | null; userToken: string | null } = {
  userInfo: null,
  userToken: loadTokenFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser; accessToken: string }>) => {
      state.userInfo = action.payload.user;
      state.userToken = action.payload.accessToken;

      // Store token in localStorage
      localStorage.setItem("userToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.userInfo = null;
      state.userToken = null;

      // Remove token from localStorage
      localStorage.removeItem("userToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.userInfo = null;
        state.userToken = null;
        localStorage.removeItem("userToken"); // Remove invalid token
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
