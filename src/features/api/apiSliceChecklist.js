import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiChecklist = createApi({
  reducerPath: 'apiChecklist',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.172:83/Service.asmx/',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  endpoints: (builder) => ({
    submitTrialRequisition: builder.mutation({
      query: (formData) => ({
        url: 'prc_npd_enquiry_trial_requisition_note_set',
        method: 'POST',
        body: formData,
      }),
    }),
    mouldInspectionChecksheekFill: builder.query({
      query: (userData) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 12,
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
          console.error('Transform error for checksheet types:', error);
          return [];
        }
      },
    }),
    
    mouldInspectionCheckSheetTable: builder.query({
      query: ({ userData, lookupId }) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 13,
          pLookUpId: lookupId,
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
          console.error('Transform error for table data:', error);
          return [];
        }
      },
    }),
    

    toolDesignReview: builder.query({
      query: (userData) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 14,
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
          console.error('Transform error for customers:', error);
          return [];
        }
      },
    }),
     
    submitToolDesignReview: builder.mutation({
      query: (payload) => ({
        url: 'prc_npd_enquiry_tool_design_review_check_list_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    }),
    

  }),
});

export const { 
  useSubmitTrialRequisitionMutation,
  useToolDesignReviewQuery, 
  useSubmitToolDesignReviewMutation,
  useLazyMouldInspectionCheckSheetTableQuery,
  useMouldInspectionChecksheekFillQuery,
} = apiChecklist;
