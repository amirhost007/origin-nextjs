import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "todoEdit",
  initialState: { isLoggedIn: false, userData: {} },
  reducers: {
    loggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    userDataUpdate: (state, action) => {
      state.userData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loggedIn, userDataUpdate } = authSlice.actions;

export default authSlice.reducer;
