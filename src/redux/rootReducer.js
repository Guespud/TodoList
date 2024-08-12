import { configureStore } from "@reduxjs/toolkit";
import setlistSlice  from "./store/listSlice";


export const rootReducer = configureStore({
  reducer: {
   setlistSlice
  }
});
