import { configureStore } from "@reduxjs/toolkit";

import buttonReducer from "./button-slice";

const store = configureStore({
  reducer: {
    buttonFuncs: buttonReducer,
  },
});

export default store;
