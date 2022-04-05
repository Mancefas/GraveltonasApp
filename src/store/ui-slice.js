import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showStartTimeComponent: true,
    showFinishTimeComponent: false,
    showAddRacerComponent: false,
    showChangesToRacerComponent: false,
  },
  reducers: {
    showStart(state) {
      state.showStartTimeComponent = true;
      state.showFinishTimeComponent = false;
      state.showAddRacerComponent = false;
      state.showChangesToRacerComponent = false;
    },

    showFinish(state) {
      state.showStartTimeComponent = false;
      state.showFinishTimeComponent = true;
      state.showAddRacerComponent = false;
      state.showChangesToRacerComponent = false;
    },
    showAddRacer(state) {
      state.showStartTimeComponent = false;
      state.showAddRacerComponent = true;
      state.showFinishTimeComponent = false;
      state.showChangesToRacerComponent = false;
    },
    showChangesToRacer(state) {
      state.showStartTimeComponent = false;
      state.showChangesToRacerComponent = true;
      state.showFinishTimeComponent = false;
      state.showAddRacerComponent = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
