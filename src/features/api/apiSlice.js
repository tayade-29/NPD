import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.172:83/Service.asmx/',
  }),
  tagTypes: ['Customer', 'Employee', 'Roles'],
  endpoints: (builder) => ({
    // Add the new getRoles endpoint
    getRoles: builder.query({
      query: (params) => ({
        url: 'prc_master_fill',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: 2,
          pLookUpId: 0,
          pLookUpType: 0,
          pSelectionType: 1,
          pClientId: params.pClientId,
          pPlantId: params.pPlantId,
          pLocationId: params.pLocationId
        }),
      }),
      transformResponse: (response) => {
        try {
          const parsed = JSON.parse(response.d);
          return Array.isArray(parsed) ? parsed.map(role => ({
            label: role.DataTextField,
            value: role.DataValueField,
            sortBy: role.SortBy
          })) : [];
        } catch (error) {
          console.error('Transform error:', error);
          return [];
        }
      },
      providesTags: ['Roles']
    }),

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

    getEmployee: builder.query({
      query: (params) => ({
        url: 'prc_employee_master_get',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pAction: params.pAction || 0,
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
            FullName: employee.FullName,
            ContactNumber: employee.ContactNumber,
            EmailAddress: employee.EmailAddress,
            UserName: employee.UserName,
            Password: employee.Password,
            RoleId: employee.pFkRoleId || employee.FkRoleId || employee.RoleId,

            IsActive: employee.IsActive === "Active" || employee.IsActive === 1 || employee.IsActive === "1" ? 1 : 0,
            LocationId: employee.LocationId || 0,
            Photo: employee.Photo || ""
          })) : [];
        } catch (error) {
          console.error('Transform error:', error);
          return [];
        }
      },
      providesTags: ['Employee']
    }),

    checkDuplicateEmployee: builder.mutation({
      query: (data) => ({
        url: 'prc_check_duplicate_employee_master',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pEmployeeCode: data.pEmployeeCode,
          pFkClientId: data.pFkClientId,
          pFkLocationId: data.pFkLocationId,
          pFkRoleId: data.pFkRoleId,
          pFullName: data.pFullName,
          pUserName: data.pUserName,
          pPassword: data.pPassword,
          pPlantId: data.pPlantId
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

    addEmployee: builder.mutation({
      query: (data) => ({
        url: 'prc_employee_master_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pEmployeeCode: data.pEmployeeCode,
          pFkClientId: data.pFkClientId,
          pFkPlantId: data.pFkPlantId,
          pFkLocationId: data.pFkLocationId,
          pFkRoleId: data.pFkRoleId,
          pFullName: data.pFullName,
          pContactNumber: data.pContactNumber,
          pEmailAddress: data.pEmailAddress,
          pAllowLogin: data.pAllowLogin,
          pUserName: data.pUserName,
          pPassword: data.pPassword,
          pSkill: data.pSkill,
          pCreatedBy: data.pCreatedBy,
          pIsActive: data.pIsActive === true || data.pIsActive === 1 || data.pIsActive === "1" ? 1 : 0,
          pPhoto: data.pPhoto || ""
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


    changePassword: builder.mutation({
      query: (data) => ({
        url: 'prc_change_password_set',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pFkEmpId: data.pFkEmpId,
          pPassword: data.pPassword,
        }),
      }),
      transformResponse: (response) => {
        try {
          return JSON.parse(response.d);
        } catch {
          throw new Error("Invalid response format");
        }
      },
    }),
    
  }),
});

export const {
  useLoginUserMutation,
  useGetCustomerQuery,
  useCheckDuplicateCustomerMutation,
  useAddCustomerMutation,
  useGetEmployeeQuery,
  useCheckDuplicateEmployeeMutation,
  useAddEmployeeMutation,
  useGetRolesQuery,
  useChangePasswordMutation,

} = api;