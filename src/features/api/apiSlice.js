import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.172:83/Service.asmx/',
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (payload) => ({
        url: 'prc_prod_validate_users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        responseHandler: (response) => response.text(),
      }),
      transformResponse: (responseText) => {
        console.log('Raw text response:', responseText);
        const match = responseText.match(/{.*}/);
        if (!match) {
          throw new Error('JSON not found in response');
        }
        const rawData = JSON.parse(match[0]);
        const users = JSON.parse(rawData.d);
        return users;
      },
    }),
    addCustomer: builder.mutation({
      query: (customerData) => ({
        url: 'prc_customer_master_set',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
        responseHandler: (response) => response.text(),
      }),
      transformResponse: (responseText) => {
        console.log('Raw customer response:', responseText);
        const match = responseText.match(/{.*}/);
        if (!match) {
          throw new Error('JSON not found in response');
        }
        const rawData = JSON.parse(match[0]);
        return JSON.parse(rawData.d);
      },
    }),
  }),
});

export const { useLoginUserMutation, useAddCustomerMutation } = api;