// features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiChecklist = createApi({
  reducerPath: 'apiChecklist',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.172:83/Service.asmx/',
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    
  }),
});
