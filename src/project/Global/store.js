import { configureStore } from "@reduxjs/toolkit";
import myReducer from "./Redux";

export const store = configureStore({
  reducer: { myReducer },
});
