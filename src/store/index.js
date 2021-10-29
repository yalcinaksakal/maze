import { configureStore } from "@reduxjs/toolkit";

import loadingReducer from "./loading-slice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
  },
});

export default store;
