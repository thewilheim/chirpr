import { configureStore, Store } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice.ts";
import authSliceReducer from "./slices/authSlice.ts";
const store: Store = configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;