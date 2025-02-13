import {
  fetchBaseQuery,
  createApi,
  BaseQueryApi,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "./authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_HOST_URL,
  credentials: "include",
  prepareHeaders(headers, { getState }) {
    //@ts-expect-error no error should come
    const token = getState().auth.userToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});


const baseQueryWithReAuth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("sending refresh token");

    const refreshResult = await baseQuery("/api/v1/User/refresh", api, extraOptions);
    console.log(refreshResult);

    if (refreshResult.data) {
      //@ts-expect-error no error should come
      const user = api.getState().auth.user;
      // Store data here via dispatch
      //@ts-expect-error no error should come
      api.dispatch(setCredentials({user, accessToken: refreshResult?.data?.accessToken}))
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result
};


export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Chirp", "User", "Replies"],
    endpoints: () => ({}),
  });


  export const selectCurrentUser = (state: RootState) => state.auth.userInfo
  export const selectCurrentToken = (state: RootState) => state.auth.userToken