import { createSlice } from "@reduxjs/toolkit";

const sharedDataSlice = createSlice({
  name: "sharedData",
  initialState: {
    raceStart: new Date("2021-10-17T11:00:00"),
  },
  reducers: {},
});

export const sharedDataActions = sharedDataSlice.actions;

export default sharedDataSlice;
