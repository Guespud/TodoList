import { createSlice } from "@reduxjs/toolkit";

export const listSlice = createSlice({
  name: "listSlice",
  initialState: {
    data: {
      todo: [],
      inProgress: [],
      done: []
  },
  },
  reducers: {
    setlistSlice: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setlistSlice } = listSlice.actions;

export default listSlice.reducer;
