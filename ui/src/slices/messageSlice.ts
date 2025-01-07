import { apiSlice } from './apiSlice';

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserConversations: builder.query({
      query: () => ({
        url: `/api/v1/conversation`,
        method: 'GET',
      }),
    }),
    getConversationMessages: builder.query({
      query: (conversationId) => ({
        url: `/api/v1/message/conversation/${conversationId}`,
        method: 'GET',
      }),
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/api/v1/message/send',
        method: 'POST',
        body: data,
      }),
    }),
    createConversation: builder.mutation({
      query: (data) => ({
        url: '/api/v1/conversation/create',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useCreateConversationMutation,
} = messageApiSlice;  