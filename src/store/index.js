import { configureStore } from "@reduxjs/toolkit";
import sharedDataSlice from "./shared-data-slice";
import uiSlice from "./ui-slice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    sharedData: sharedDataSlice.reducer,
  },
});

export default store;
