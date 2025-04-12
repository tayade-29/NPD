import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.172:83/Service.asmx/',
  }),
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (payload) => ({
        url: 'prc_prod_validate_users',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
      transformResponse: (response) => {
        try {
          const parsedResponse = JSON.parse(response.d);
          return parsedResponse;
        } catch (error) {
          console.error('Error parsing login response:', error);
          throw new Error('Invalid response format from server');
        }
      },
    }),
    
    getCustomer: builder.query({
      query: (params) => ({
        url: 'prc_customer_master_get',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pAction: 0,
          pLookUpId: params.pLookUpId || 0,
          pFkClientId: params.pFkClientId,
          pFkPlantId: params.pFkPlantId
        }),
      }),
      transformResponse: (response) => {
        if (!response) return [];
        try {
          const parsedResponse = JSON.parse(response.d);
          return Array.isArray(parsedResponse) ? parsedResponse : [];
        } catch (error) {
          console.error('Error parsing customer response:', error);
          return [];
        }
      },
      providesTags: ['Customer']
    }),

    addCustomer: builder.mutation({
      query: (customerData) => ({
        url: 'prc_customer_master_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pPkCustomerId: customerData.pPkCustomerId || 0,
          pFkClientID: customerData.pFkClientID,
          pFkPlantId: customerData.pFkPlantId,
          pCustomerCode: customerData.pCustomerCode,
          pCustomerName: customerData.pCustomerName,
          pAddress: customerData.pAddress,
          pContactPerson: customerData.pContactPerson,
          pPhoneNo: customerData.pPhoneNo,
          pEmailId: customerData.pEmailId,
          pCreatedBy: customerData.pCreatedBy,
          pIsActive: customerData.pIsActive
        }),
      }),
      transformResponse: (response) => {
        if (!response) throw new Error('No response received');
        try {
          const parsedResponse = JSON.parse(response.d);
          return parsedResponse;
        } catch (error) {
          console.error('Error parsing add customer response:', error);
          throw new Error('Failed to process server response');
        }
      },
      invalidatesTags: ['Customer']
    }),
  }),
});

export const { 
  useGetCustomerQuery,
  useAddCustomerMutation,
  useLoginUserMutation,
} = api;