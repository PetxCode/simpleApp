import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectID: [],
  personalID: [],
  taslID: [],
};

const Redux = createSlice({
  name: "redux",
  initialState,
  reducers: {
    getProjectID: (state, { payload }) => {
      state.projectID = payload;
    },

    getPersonalID: (state, { payload }) => {
      state.personalID = payload;
    },

    getTaskID: (state, { payload }) => {
      state.personalID = payload;
    },
  },
});

export const { getProjectID, getPersonalID, getTaskID } = Redux.actions;
export default Redux.reducer;
