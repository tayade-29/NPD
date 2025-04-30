import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.172:83/Service.asmx/',
  }),
  tagTypes: ['Customer', 'Employee'],
  endpoints: (builder) => ({
    loginUser :builder.mutation({
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

    getActivityPhases: builder.query({
      query: ({ clientId, plantId, locationId }) => ({
        url: "/prc_master_fill",
        method: "POST",
        body: {
          pAction: 5,
          pLookUpId: 0,
          pLookUpType: 0,
          pSelectionType: 1,
          pClientId: clientId,
          pPlantId: plantId,
          pLocationId: locationId
        }
      }),
      transformResponse: (response) => {
        try {
          const parsed = JSON.parse(response.d);
          return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
          console.error("ActivityPhase Transform Error:", err);
          return [];
        }
      }
    }),

    getSubactivities: builder.query({
      query: ({ lookUpId, clientId, plantId, locationId }) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 6,
          pLookUpId: lookUpId,
          pLookUpType: 0,
          pSelectionType: 0,
          pClientId: clientId,
          pPlantId: plantId,
          pLocationId: locationId
        }),
      }),
      transformResponse: (response) => {
        try {
          const parsed = JSON.parse(response.d);
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          console.error("Error parsing subactivities:", error);
          return [];
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

    getEmployees: builder.query({
      query: (params) => ({
        url: 'prc_employee_master_get',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 0,
          pLookUpId: params.pLookUpId || 0,
          pFkClientId: params.pFkClientId,
          pFkPlantId: params.pFkPlantId,
          pFkLocationId: params.pFkLocationId || 0
        }),
      }),
      transformResponse: (response) => {
        try {
          const parsed = JSON.parse(response.d);
          return Array.isArray(parsed) ? parsed.map(employee => ({
            EmployeeCode: employee.EmployeeCode,
            LocationId: employee.LocationId,
            LocationName: employee.LocationName,
            FullName: employee.FullName,
            ContactNumber: employee.ContactNumber,
            EmailAddress: employee.EmailAddress,
            UserName: employee.UserName,
            RoleId: employee.RoleId,
            RoleName: employee.RoleName,
            IsActive: employee.IsActive === "Active" || employee.IsActive === 1 || employee.IsActive === "1" ? 1 : 0,
            AllowLogin: employee.AllowLogin === 1 || employee.AllowLogin === "1" || employee.AllowLogin === true
          })) : [];
        } catch (error) {
          console.error('Transform error:', error);
          return [];
        }
      },
      providesTags: ['Employee']
    }),

    addEmployee: builder.mutation({
      query: (data) => ({
        url: 'prc_employee_master_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pEmployeeCode: data.pEmployeeCode,
          pFkClientId: data.pFkClientId,
          pFkPlantId: data.pFkPlantId,
          pFkLocationId: data.pFkLocationId || '',
          pFkRoleId: data.pFkRoleId || '',
          pFullName: data.pFullName,
          pContactNumber: data.pContactNumber,
          pEmailAddress: data.pEmailAddress,
          pAllowLogin: data.pAllowLogin ? 1 : 0,
          pUserName: data.pUserName || '',
          pPassword: data.pPassword || '',
          pSkill: data.pSkill || '',
          pCreatedBy: data.pCreatedBy,
          pIsActive: data.pIsActive ? 1 : 0,
          pPhoto: data.pPhoto || ''
        })
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d);
        } catch (error) {
          throw new Error('Invalid response format');
        }
      },
      invalidatesTags: ['Employee']
    }),

    getResponsibilities: builder.query({
      query: ({ clientId, plantId, locationId }) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 7,
          pLookUpId: 0,
          pLookUpType: 0,
          pSelectionType: 0,
          pClientId: clientId || 1,
          pPlantId: plantId || 1,
          pLocationId: locationId || 1
        }),
      }),
      transformResponse: (response) => {
        try {
          const data = JSON.parse(response.d);
          return Array.isArray(data) ? data : [];
        } catch (error) {
          console.error("Error parsing Responsibility list:", error);
          return [];
        }
      },
    }),
    
    saveApqpTimePlan: builder.mutation({
      query: (data) => ({
        url: 'prc_npd_apqp_time_plan_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d);
        } catch (error) {
          throw new Error('Invalid response format');
        }
      }
    }),

    getPendingApqpTimePlan: builder.query({
      query: ({ pAction, pLookUpId, pEnquiryMasterId }) => ({
        url: 'prc_npd_apqp_time_plan_pending_get',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pAction, pLookUpId, pEnquiryMasterId })
      }),
      transformResponse: (response) => {
        try {
          const parsed = JSON.parse(response.d);
          return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
          console.error("Error parsing pending APQP time plan:", err);
          return [];
        }
      }
    }),
    
    



    // ✅ New Endpoint: getNpdEnquiryRegister
    getNpdEnquiryRegister: builder.query({
      query: () => ({
        url: 'prc_npd_enquiry_register_get',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 2,
          pLookUpId: 0
        }),
      }),
      transformResponse: (response) => {
        try {
          const data = JSON.parse(response.d);
          return Array.isArray(data) ? data : [];
        } catch (error) {
          console.error("Error parsing NPD enquiry data:", error);
          return [];
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetEmployeesQuery,
  useAddEmployeeMutation,
  useGetCustomerQuery,
  useAddCustomerMutation,
  useLoginUserMutation,
  useCheckDuplicateCustomerMutation,
  useGetNpdEnquiryRegisterQuery, // ✅ Export the new hook
  useGetResponsibilitiesQuery,
  useSaveApqpTimePlanMutation,
  useGetActivityPhasesQuery, // 👉 Add this line
  useGetSubactivitiesQuery,
  useGetPendingApqpTimePlanQuery,



  
} = api;
