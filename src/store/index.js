import { configureStore } from "@reduxjs/toolkit";

import statusReducer from "./status";

const store = configureStore({
  reducer: {
    status: statusReducer,
  },
});

export default store;
