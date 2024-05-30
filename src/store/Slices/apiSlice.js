import { getCookieData } from "@/utils/helper";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
const axios = require('axios');

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  // baseQuery: async (baseUrl, prepareHeaders, ...rest) => {
  //   console.log("baseUrl rest :", baseUrl," - ", rest)
  //   const response = await fetch(
  //     `http://v1.checkprojectstatus.com/haleh-car/api/${baseUrl}`,
  //     rest
  //   );
  //   return { data: await response.json() };
  // },
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      const nextState = {
        ...state,
        ...action.payload[reducerPath],
      };
      return nextState;
      // return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getHomeData: builder.query({
      query: (data) =>
        data && data.lang
          ? `home?lang_id=${data.lang}&role_id=${
              data.role_id ? data.role_id : 1
            }`
          : "home",
    }),
    subscribe: builder.mutation({
      query: (data) => ({
        url: "subscribe",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["TODOS"],
    }),
    getInTouch: builder.mutation({
      query: (data) => ({
        url: "get_in_touch",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["TODOS"],
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["TODOS"],
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["TODOS"],
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `user/profile`,

        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
      }),
      // transformResponse:res=>res.sort((a,b)=>a-b)
      providesTags: ["USER_PROFILE"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `user/update_profile`,
        method: "POST",
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        body: data,
      }),
      invalidatesTags: ["USER_PROFILE"],
    }),
    updateImage: builder.mutation({
      query: (data) => ({
        url: `user/update-image`,
        method: "POST",
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        body: data,
      }),
      invalidatesTags: ["USER_PROFILE"],
    }),
    updateLangForUser: builder.mutation({
      query: (data) => ({
        url: `user/update-language`,
        method: "POST",
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `change-password`,
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `forget-password`,
        method: "POST",
        body: data,
      }),
    }),
    getReferCode: builder.query({
      query: ({ lang }) => ({
        url: lang ? `user/refer-friend?lang_id=${lang}` : `user/refer-friend`,

        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
      }),
      // transformResponse:res=>res.sort((a,b)=>a-b)
      // providesTags: ["USER_PROFILE"],
    }),
    lookingLocalSupplier: builder.mutation({
      query: (data) => ({
        url: `looking-local-supplier`,
        method: "POST",
        body: data,
      }),
    }),

    addFeedback: builder.mutation({
      query: (data) => ({
        url: `user/feedback`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
    }),
    supplerEnquiry: builder.mutation({
      query: (data) => ({
        url: `register_supplier`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
    }),
    partnerEnquiry: builder.mutation({
      query: (data) => ({
        url: `register_partner`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
    }),
    getIndustries: builder.query({
      query: () => ({
        url: `industry`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
      }),
    }),
    getHelpEnquiry: builder.query({
      query: ({ lang }) =>
        lang ? `help-enquiry?lang_id=${lang}` : `help-enquiry`,
    }),
    getMasterSetting: builder.query({
      query: ({ lang, currency_id }) => ({
        url: lang
          ? `user/master-setting?lang_id=${lang}&currency_id=${
              currency_id ? currency_id : ""
            }`
          : `user/master-setting`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
      }),
      providesTags: ["MASTER_SETTING"],
    }),
    partnerCommission: builder.mutation({
      query: (data) => ({
        url: `user/commission`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MASTER_SETTING"],
    }),
    searchVehical: builder.query({
      query: ({ data, queryUrl }) => ({
        url: `searching?${queryUrl}`,

        method: "POST",
        body: data,
      }),
    }),
    vehicalDetails: builder.query({
      query: (data) => ({
        url: `vehicle-detail`,

        method: "POST",
        body: data,
      }),
    }),
    addCarBooking: builder.query({
      query: (data) => ({
        url: `user/add-car`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
      providesTags: ["ADD_CAR_BOOKING"],
    }),
    modifyBooking: builder.query({
      query: (data) => ({
        url: `user/modify-booking`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
      providesTags: ["MODIFY_CAR_BOOKING"],
    }),
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: `user/coupon`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ADD_CAR_BOOKING", "MODIFY_CAR_BOOKING"],
    }),
    removeCoupon: builder.mutation({
      query: (data) => ({
        url: `user/remove-coupon`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ADD_CAR_BOOKING", "MODIFY_CAR_BOOKING"],
    }),
    orderBooking: builder.mutation({
      query: (data) => ({
        url: `user/order`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
    }),
    orderWithoutCreditCard: builder.mutation({
      query: (data) => ({
        url: `user/without-credit-order`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
    }),
    manageBooking: builder.query({
      query: (data) => ({
        url: `manage-booking`,

        method: "POST",
        body: data,
      }),
      providesTags: ["MANAGE_BOOKING"],
    }),
    getUserAllBookings: builder.query({
      query: (data) => ({
        url: data ? `user/booking?${data}` : `user/booking`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },

        // body: data,
      }),
    }),
    bookingReferenceNumber: builder.mutation({
      query: (data) => ({
        url: `booking-refrence-number`,

        method: "POST",
        body: data,
      }),
    }),
    allLocaltion: builder.query({
      query: () => `all-location`,
    }),
    bookingRating: builder.mutation({
      query: (data) => ({
        url: `user/rating`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MANAGE_BOOKING"],
    }),
    cancelBooking: builder.mutation({
      query: (data) => ({
        url: `user/cancle-booking`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
    }),
    getOrderDetails: builder.query({
      query: (data) => ({
        url: `user/get-last-order-detail`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
        method: "POST",
        body: data,
      }),
    }),
    getPartnerBooking: builder.query({
      query: (queryUrl) => ({
        url: queryUrl
          ? `user/partner-booking?${queryUrl}`
          : `user/partner-booking`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
      }),
    }),
    getPartnerRevenue: builder.query({
      query: (queryUrl) => ({
        url: queryUrl ? `user/revenue-list?${queryUrl}` : `user/revenue-list`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
      }),
    }),
    staticContent: builder.query({
      query: (lang_id) => ({
        url: lang_id ? `static-content?lang_id=${lang_id}` : `static-content`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
      }),
    }),
    privacyPolicy: builder.query({
      query: (lang_id) => ({
        url: lang_id ? `privacy-policy?lang_id=${lang_id}` : `privacy-policy`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
      }),
    }),
    termsCondition: builder.query({
      query: (lang_id) => ({
        url: lang_id ? `term-condition?lang_id=${lang_id}` : `term-condition`,
        headers: {
          Authorization: "Basic " + getCookieData("origin_rent_token"),
        },
      }),
    }),
    trackApi: builder.query({
      query: () => ({
        url: `https://ipapi.co/json/`,
      }),
    }),
    supplierLogo: builder.query({
      query: () => ({
        url: `/supplier-logo`,
      }),
    }),
    // guest_login: builder.query({
    //   query: () => ({
    //     url: `guest-login`,
    //     headers: {
    //       Authorization: "Basic " + getCookieData("origin_rent_token"),
    //     },
    //   }),
    // }),
    guest_login: builder.mutation({
      query: () => ({
        url: `guest-login`,
      }),
    }),
    social_login: builder.mutation({
      query: (data) => ({
        url: `social-login`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetHomeDataQuery,
  useSubscribeMutation,
  useGetInTouchMutation,
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUpdateImageMutation,
  useGetReferCodeQuery,
  useUpdateLangForUserMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useLookingLocalSupplierMutation,
  useAddFeedbackMutation,
  useSupplerEnquiryMutation,
  usePartnerEnquiryMutation,
  useGetIndustriesQuery,
  useGetHelpEnquiryQuery,
  useGetMasterSettingQuery,
  usePartnerCommissionMutation,
  useSearchVehicalQuery,
  useVehicalDetailsQuery,
  useAddCarBookingQuery,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useOrderBookingMutation,
  useManageBookingQuery,
  useGetUserAllBookingsQuery,
  useBookingReferenceNumberMutation,
  useAllLocaltionQuery,
  useBookingRatingMutation,
  useCancelBookingMutation,
  useGetOrderDetailsQuery,
  useModifyBookingQuery,
  useGetPartnerBookingQuery,
  useSocial_loginMutation,
  useGetPartnerRevenueQuery,
  useGuest_loginMutation,
  useOrderWithoutCreditCardMutation,
  useStaticContentQuery,
  useTrackApiQuery,
  usePrivacyPolicyQuery,
  useTermsConditionQuery,
  useSupplierLogoQuery,
  //   useDeleteTodoMutation,

  util: { getRunningQueriesThunk },
} = apiSlice;

export const { getHomeData } = apiSlice.endpoints;
