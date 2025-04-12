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
          return JSON.parse(response.d);
        } catch (error) {
          throw new Error('Invalid response format');
        }
      },
    }),

    getCustomer: builder.query({
      query: (params) => ({
        url: 'prc_customer_master_get',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: params.pAction || 0,
          pLookUpId: params.pLookUpId || 0,
          pFkClientId: params.pFkClientId,
          pFkPlantId: params.pFkPlantId
        }),
      }),
      transformResponse: (response) => {
        try {
          const parsed = JSON.parse(response.d);
          return Array.isArray(parsed) ? parsed.map(customer => ({
            pPkCustomerId: customer.pPkCustomerId,
            CustomerCode: customer.CustomerCode,
            CustomerName: customer.CustomerName,
            Address: customer.Address,
            ContactPerson: customer.ContactPerson,
            PhoneNo: customer.PhoneNo,
            EmailId: customer.EmailId,
            IsActive: customer.IsActive === "Active" || customer.IsActive === 1 || customer.IsActive === "1" ? 1 : 0
          })) : [];
        } catch (error) {
          console.error('Transform error:', error);
          return [];
        }
      },
      providesTags: ['Customer']
    }),

    checkDuplicateCustomer: builder.mutation({
      query: (data) => ({
        url: 'prc_check_duplicate_customer_master',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pPkCustomerId: data.pPkCustomerId,
          pFkClientID: data.pFkClientId,
          pFkPlantId: data.pFkPlantId,
          pCustomerCode: data.pCustomerCode,
          pCustomerName: data.pCustomerName,
          pAddress: data.pAddress,
          pContactPerson: data.pContactPerson,
          pPhoneNo: data.pPhoneNo,
          pEmailId: data.pEmailId
        })
      }),
      transformResponse: (response) => {
        try {
          const result = JSON.parse(response.d);
          return { isDuplicate: result.length > 0 };
        } catch (error) {
          throw new Error('Invalid response format');
        }
      }
    }),

    addCustomer: builder.mutation({
      query: (data) => ({
        url: 'prc_customer_master_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pPkCustomerId: data.pPkCustomerId,
          pFkClientID: data.pFkClientID,
          pFkPlantId: data.pFkPlantId,
          pCustomerCode: data.pCustomerCode,
          pCustomerName: data.pCustomerName,
          pAddress: data.pAddress,
          pContactPerson: data.pContactPerson,
          pPhoneNo: data.pPhoneNo,
          pEmailId: data.pEmailId,
          pCreatedBy: data.pCreatedBy,
          pIsActive: data.pIsActive === true || data.pIsActive === 1 || data.pIsActive === "1" ? 1 : 0
        })
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d);
        } catch (error) {
          throw new Error('Invalid response format');
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
  useCheckDuplicateCustomerMutation,
} = api;