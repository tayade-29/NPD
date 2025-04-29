import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiEnquiry = createApi({
  reducerPath: 'apiEnquiry',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.172:83/Service.asmx/',
  }),
  tagTypes: ['Enquiry', 'Customer', 'Password'],
  endpoints: (builder) => ({
    getEnquiries: builder.query({
      query: () => ({
        url: 'prc_npd_enquiry_register_get',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 0,
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
    getEnquiriesFeasibility: builder.query({
      query: () => ({
        url: 'prc_npd_enquiry_register_get',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 2,
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

    getEnquiriesById: builder.query({
      query: ({ pAction = 0, pLookUpId = 0 }) => ({
        url: 'prc_npd_enquiry_register_get',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pAction, pLookUpId })
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

    getCheckpointsForFeasibility: builder.query({
      query: (userData) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 8,
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

    getSubCheckpointForFeasibility: builder.query({
      query: (params) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 9,
          pLookUpId: params.checkpointId || 0,
          pLookUpType: 0,
          pSelectionType: 0,
          pClientId: params.clientId || 1,
          pPlantId: params.plantId || 1,
          pLocationId: params.locationId || 1
        })
      }),
      transformResponse: (response) => {
        try {
          if (!response.d) return [];
          const parsed = JSON.parse(response.d);
          return Array.isArray(parsed) ? parsed : JSON.parse(parsed);
        } catch (error) {
          console.error('Transform error for sub-checkpoints:', error);
          return [];
        }
      },
      providesTags: ['SubCheckpoint']
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
          pPkEnquiryMasterId: data.pPkEnquiryMasterId || 0,
          pFkCustomerId: data.pFkCustomerId,
          pProjectName: data.projectVehicleProgram,
          pPartCode: data.partCode,
          pPartName: data.partName,
          pRawMaterialName: data.rawMaterial,
          pRemark: data.remark || '',
          pIsStatus: data.isStatus === 1 ? 1 : 0,
        })
      }),
    }),


    changePassword: builder.mutation({
      query: (data) => ({
        url: 'prc_change_password_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pFkEmpId: data.pFkEmpId,
          pPassword: data.pPassword
        })
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d || '{}');
        } catch (error) {
          console.error('Transform error:', error);
          return { error: 'Failed to process response' };
        }
      }
    }),

    getCheckpoints: builder.query({
      query: (userData) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 10,
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


    saveFeasibilityCheck: builder.mutation({
      query: (data) => ({
        url: 'prc_npd_enquiry_initial_feasibility_study_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pPkNPDEnquiryInitialFeasibilityStudyId: 0, // or use existing if editing
          pFkEnquiryMasterId: data.pFkEnquiryMasterId,
          pFkNPDPreliminaryInitialStudyId: data.pFkNPDPreliminaryInitialStudyId, // DataValueField
          pFkResponsiblePersonId: data.pFkResponsiblePersonId,
          pCommentActionRequired: data.pCommentActionRequired,
          pTargetDate: data.pTargetDate,
          pCreatedBy: data.pCreatedBy,
        }),
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d || '{}');
        } catch (error) {
          console.error('Transform error:', error);
          return { error: 'Failed to process response' };
        }
      }
    }),

    saveQuotationDetails: builder.mutation({
      query: (data) => ({
        url: 'prc_npd_enquiry_quotation_detail_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pPkEnquiryMasterId: data.pPkEnquiryMasterId,
          pQuotationNo: data.pQuotationNo,
          pQuotationDate: data.pQuotationDate,
          pPartCost: data.pPartCost,
          pToolCost: data.pToolCost
        })
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d || '{}');
        } catch (error) {
          console.error('Transform error:', error);
          return { error: 'Failed to process response' };
        }
      }
    }),

    saveCustomerPODetails: builder.mutation({
      query: (data) => ({
        url: 'prc_npd_enquiry_customer_po_detail_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pPkEnquiryMasterId: data.pPkEnquiryMasterId,
          pCustomerPODate: data.pCustomerPODate,
          pCustomerPONo: data.pCustomerPONo
        })
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d || '{}');
        } catch (error) {
          console.error('Transform error:', error);
          return { error: 'Failed to process response' };
        }
      }
    }),

    getResponsiblePerson: builder.query({
      query: (userData) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 7,
          pLookUpId: 0,
          pLookUpType: 0,
          pSelectionType: 0,
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
          console.error('Transform error:', error);
          return [];
        }
      },
      providesTags: ['Customer']
    }),

    setFeasibilityReview: builder.mutation({
      query: (body) => ({
        url: 'prc_npd_enquiry_feasibility_review_set',
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

  })
});

export const {
  useGetEnquiriesQuery,
  useGetEnquiriesFeasibilityQuery,
  useGetEnquiriesByIdQuery,
  useGetCustomersQuery,
  useCheckDuplicateEnquiryMutation,
  useAddEnquiryMutation,
  useChangePasswordMutation,
  useGetCheckpointsQuery,
  useSaveFeasibilityCheckMutation,
  useSaveQuotationDetailsMutation,
  useSaveCustomerPODetailsMutation,
  useGetResponsiblePersonQuery,
  useGetCheckpointsForFeasibilityQuery,
  useGetSubCheckpointForFeasibilityQuery,
  useSetFeasibilityReviewMutation


} = apiEnquiry;