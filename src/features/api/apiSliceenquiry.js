import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiEnquiry = createApi({
  reducerPath: 'apiEnquiry',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.172:83/Service.asmx/',
  }),
  tagTypes: ['Enquiry', 'Customer'],
  endpoints: (builder) => ({
    getEnquiries: builder.query({
      query: () => ({
        url: 'prc_npd_enquiry_register_get',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 1,
          pLookUpId: 0
        })
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d || '[]');
        } catch (error) {
          console.error('Transform error:', error);
          return [];
        }
      },
      providesTags: ['Enquiry']
    }),

    getCustomers: builder.query({
      query: (userData) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 1,
          pLookUpId: 0,
          pLookUpType: 0,
          pSelectionType: 1,
          pClientId: userData?.clientId || 1,
          pPlantId: userData?.plantId || 1,
          pLocationId: userData?.locationId || 1
        })
      }),
      transformResponse: (response) => {
        try {
          if (!response.d) return [];
          const parsed = JSON.parse(response.d);
          return Array.isArray(parsed) ? parsed : JSON.parse(parsed);
        } catch (error) {
          console.error('Transform error for customers:', error);
          return [];
        }
      },
      providesTags: ['Customer']
    }),

    checkDuplicateEnquiry: builder.mutation({
      query: (data) => ({
        url: 'prc_check_duplicate_npd_enquiry_register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pPkEnquiryMasterId: data.pPkEnquiryMasterId || 0,
          pFkCustomerId: data.pFkCustomerId,
          pProjectName: data.projectVehicleProgram,
          pPartCode: data.partCode,
          pPartName: data.partName,
          pRawMaterialName: data.rawMaterial
        })
      }),
      transformResponse: (response) => {
        try {
          const result = JSON.parse(response.d || '[]');
          return { isDuplicate: result[0]?.DataCount > 0 };
        } catch (error) {
          console.error('Transform error:', error);
          return { isDuplicate: false };
        }
      }
    }),

    addEnquiry: builder.mutation({
      query: (data) => ({
        url: 'prc_npd_enquiry_register_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pPkEnquiryMasterId: data.pPkEnquiryMasterId || 1,
          pFkCustomerId: data.pFkCustomerId,
          pProjectName: data.projectVehicleProgram,
          pPartCode: data.partCode,
          pPartName: data.partName,
          pRawMaterialName: data.rawMaterial,
          pRemark: data.remark || '',
          pIsStatus: data.isStatus || 1
        })
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d || '{}');
        } catch (error) {
          console.error('Transform error:', error);
          throw new Error('Invalid response format');
        }
      },
      invalidatesTags: ['Enquiry']
    })
  })
});

export const {
  useGetEnquiriesQuery,
  useGetCustomersQuery,
  useCheckDuplicateEnquiryMutation,
  useAddEnquiryMutation
} = apiEnquiry;