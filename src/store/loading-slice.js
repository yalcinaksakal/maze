import { createSlice } from "@reduxjs/toolkit";
const NUMBER_OF_CONTENTS_TO_LOAD = 0;

const initialState = {
  isLoading: true,
  loadingMsgs: [],
  completeds: 0,
  gltf: null,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setMsg(state, action) {
      const msg = action.payload;
      if (msg.split(" ").pop() === "done") state.completeds++;
      state.loadingMsgs.push(msg);
      if (state.completeds > NUMBER_OF_CONTENTS_TO_LOAD - 1)
        state.loadingMsgs.push("Loaded successfully");
    },
    setGLTF(state, action) {
      state.gltf = action.payload;
    },
  },
});

export const loadingActions = loadingSlice.actions;
export default loadingSlice.reducer;
