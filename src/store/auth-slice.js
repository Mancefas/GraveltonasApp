import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
    loggedIn: false,
  },
  reducers: {},
});

export const authSlice = uiSlice.actions;

export default uiSlice;
