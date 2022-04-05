import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showFinishTimeComponent: true,
    showAddRacerComponent: false,
    showChangesToRacerComponent: false,
  },
  reducers: {
    showFinish(state) {
      state.showFinishTimeComponent = true;
      state.showAddRacerComponent = false;
      state.showChangesToRacerComponent = false;
    },
    showAddRacer(state) {
      state.showAddRacerComponent = true;
      state.showFinishTimeComponent = false;
      state.showChangesToRacerComponent = false;
    },
    showChangesToRacer(state) {
      state.showChangesToRacerComponent = true;
      state.showFinishTimeComponent = false;
      state.showAddRacerComponent = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
