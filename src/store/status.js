import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calculating: false,
  done: 0,
  total: 0,
};

const status = createSlice({
  name: "status",
  initialState,
  reducers: {
    setCalculating(state, action) {
      state.total = action.payload.total;
      state.calculating = action.payload.calculating;
      state.done = 0;
    },
    addDone(state) {
      state.done++;
      if (state.done > state.total - 1) state.calculating = false;
    },
  },
});

export const statusActions = status.actions;
export default status.reducer;
