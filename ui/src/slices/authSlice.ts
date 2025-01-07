import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../config/applicatonConfig";
import { authService } from "../utils/Auth/authService";

const initialState = {
  userInfo: authService.getUser()
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IUser>) => {
      state.userInfo = action.payload;
      authService.setUser(action.payload);
    },
    logout: (state) => {
      state.userInfo = null;
      authService.clearAuth();
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;