import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExist: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state, action) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export default authSlice;
export const { userExist, clearUser } = authSlice.actions;
