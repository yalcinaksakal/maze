import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  instant: null,
  simulate: null,
};

const buttonSlice = createSlice({
  name: "button",
  initialState,
  reducers: {
    setInstant(state, action) {
      state.instant = action.payload;
    },
    setSimulate(state, action) {
      state.simulate = action.payload;
    },
  },
});

export const buttonActions = buttonSlice.actions;
export default buttonSlice.reducer;
