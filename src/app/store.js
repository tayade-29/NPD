import { configureStore } from '@reduxjs/toolkit';
import { api } from '../features/api/apiSlice';
import { apiEnquiry } from '../features/api/apiSliceenquiry';
import { apiChecklist } from '../features/api/apiSliceChecklist';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [apiEnquiry.reducerPath]: apiEnquiry.reducer,
    [apiChecklist.reducerPath]: apiChecklist.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      apiEnquiry.middleware,
      apiChecklist.middleware
    ),
});
