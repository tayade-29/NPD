import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api/apiSlice';

const initialState = {
  userData: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        if (Array.isArray(payload) && payload.length > 0) {
          state.userData = payload[0];
        }
      }
    );
  },
});

export const { clearUserData } = userSlice.actions;
export const selectUserData = (state) => state.user.userData;
export default userSlice.reducer;