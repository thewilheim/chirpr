import { IUser } from "../config/applicatonConfig.ts";
import { FOLLOWER_URL, USERS_URL } from "../constrants.ts";
import { apiSlice } from "./apiSlice.js";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags:['Chirp']
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    getProfile: builder.query<IUser, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ['User'],
    }),
    getSuggestedFollowers: builder.query({
      query: (id) => ({
        url: `${FOLLOWER_URL}/suggested/${id}`,
        method: "GET",
      }),
    }),
    followUser: builder.mutation({
      query: (data: {
        followerId: number;
        followedId: number;
      }) => ({
        url: `${FOLLOWER_URL}/follow`,
        method: "POST",
        body: data,
      }),
      invalidatesTags:['Chirp']
    }),
    unfollowUser: builder.mutation({
      query: (data: {
        followerId: number;
        followedId: number;
      }) => ({
        url: `${FOLLOWER_URL}/unfollow`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chirp"],
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    update: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags:['User', 'Chirp']
    }),
  }),
});

export const {
  useLoginMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetSuggestedFollowersQuery,
  useGetProfileQuery,
  useUpdateMutation,
  useGetUserDetailsQuery,
} = usersApiSlice;
