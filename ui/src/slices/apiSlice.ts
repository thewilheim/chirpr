import {fetchBaseQuery, createApi} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_HOST_URL,
    prepareHeaders(headers) {
        return headers;
      },

      credentials: "include"    
    })

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Chirp','User','Replies'],
    endpoints: () => ({})
})