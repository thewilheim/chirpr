import { apiSlice } from './apiSlice';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (userId) => ({
        url: `/api/v1/notification/all/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Notifications']
    }),
    sendNotification: builder.mutation({
      query: (data) => ({
        url: '/api/v1/notification/send',
        method: 'POST',
        body: data,
      }),
    }),
    viewNotification: builder.mutation({
      query: (id) => ({
        url: `/api/v1/notification/view/${id}`,
        method: 'GET',
      }),
      invalidatesTags:["Notifications"]
    })
  }),
});

export const {
  useSendNotificationMutation,
  useGetNotificationsQuery,
  useViewNotificationMutation
} = notificationApiSlice;  