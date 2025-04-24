import { configureStore } from '@reduxjs/toolkit';
import { api } from '../features/api/apiSlice';
import { apiEnquiry } from '../features/api/apiSliceenquiry';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [apiEnquiry.reducerPath]: apiEnquiry.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, apiEnquiry.middleware)
});