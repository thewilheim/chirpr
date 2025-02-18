import { IChirp } from '../config/applicatonConfig.ts';
import { CHIRPS_URL } from '../constrants.ts';
import { apiSlice } from "./apiSlice.js";

export const chirpsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChirps: builder.query<IChirp[],void>({
      query: () => ({
        url: `${CHIRPS_URL}/all`
      }),
      providesTags: ((result = []) => [
        'Chirp',
        ...result.map(({id}) => ({type: 'Chirp', id}) as const)
      ]),
      keepUnusedDataFor: 5,
    }),
    createChirp: builder.mutation({
      query: (data) => ({
        url: `${CHIRPS_URL}/create`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Chirp"],
    }),
    getChirpById: builder.query<IChirp, string>({
      query: (id: string) => ({
        url: `${CHIRPS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, arg) => [{ type: 'Chirp', id: arg }]
    }),
    getChirpByUserId: builder.query<IChirp[], string>({
      query: (id: string) => ({
        url: `${CHIRPS_URL}/getAllByUserID/${id}`,
        method: "GET",
      }),
      providesTags: ((result = []) => [
        'Chirp',
        ...result.map(({id}) => ({type: 'Chirp', id}) as const)
      ]),
    }),
    deleteChirp: builder.mutation({
      query: (id) => ({
        url: `${CHIRPS_URL}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:["Chirp"]
    }),
    createReply: builder.mutation({
      query: (data) => ({
        url: `${CHIRPS_URL}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chirp"],
    }),
    getReplies: builder.query<IChirp[], string>({
        query: (id: string) => ({
          url: `${CHIRPS_URL}/${id}/replies`,
          method: "GET",
        }),
        providesTags: ((result = []) => [
          'Chirp',
          ...result.map(({id}) => ({type: 'Chirp', id}) as const)
        ]),
        keepUnusedDataFor: 5,
      }),
      deleteReply: builder.mutation({
        query: (data) => ({
          url: `${CHIRPS_URL}/delete/${data._id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["Chirp"],
      }),
      likeChirp: builder.mutation<IChirp, {user_id: number, chirp_id:number}>({
        query: (data:{user_id: number, chirp_id:number}) => ({
          url: `${CHIRPS_URL}/like`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Chirp"]
      }),
      unlikeChirp: builder.mutation({
        query: (data:{user_id: number, chirp_id:number}) => ({
          url: `${CHIRPS_URL}/unlike`,
          method: "DELETE",
          body: data,
        }),
        invalidatesTags: ["Chirp"]
      }),
      viewChirp: builder.mutation({
        query: (data:{userId: number, chirpId:number}) => ({
          url: `${CHIRPS_URL}/view`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Chirp"]
      })
  }),
  
});

export const {
  useGetChirpsQuery,
  useCreateChirpMutation,
  useGetChirpByIdQuery,
  useDeleteChirpMutation,
  useCreateReplyMutation,
  useGetRepliesQuery,
  useDeleteReplyMutation,
  useLikeChirpMutation,
  useUnlikeChirpMutation,
  useGetChirpByUserIdQuery,
  useViewChirpMutation
} = chirpsApiSlice;
