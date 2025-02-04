import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../config/applicatonConfig";

// Load saved auth state from local storage
const loadFromLocalStorage = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    const userToken = localStorage.getItem("userToken");
    return {
      userInfo: userInfo ? JSON.parse(userInfo) : null,
      userToken: userToken || null,
    };
  } catch (error) {
    console.error("Error loading from local storage", error);
    return { userInfo: null, userToken: null };
  }
};

const initialState: { userInfo: IUser | null; userToken: string | null } = loadFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser; accessToken: string }>) => {
      const { user, accessToken } = action.payload;
      state.userInfo = user;
      state.userToken = accessToken;

      // Save to local storage
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("userToken", accessToken);
    },
    logout: (state) => {
      state.userInfo = null;
      state.userToken = null;

      // Remove from local storage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
