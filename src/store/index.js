import { createWrapper } from "next-redux-wrapper";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { apiSlice } from "@/store/Slices/apiSlice";
import { authSlice } from "./Slices/authSlice";
import { headerSlice } from "./Slices/headerSlice";

// config the store
const store = configureStore({
  reducer: {
    //   icon: iconslice.reducer
    auth: authSlice.reducer,
    headData: headerSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// export default the store
export default store;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

const makestore = () => store;
export const wrapper = createWrapper(makestore);

//  Test purpose

// import { configureStore } from "@reduxjs/toolkit";

// export const makeStore = () =>
//   configureStore({
//     reducer: {
//       auth: authSlice.reducer,
//       headData: headerSlice.reducer,
//       [apiSlice.reducerPath]: apiSlice.reducer,
//     },
//     middleware: (gDM) => gDM().concat(apiSlice.middleware),
//   });

// export const wrapper = createWrapper(store, { debug: true });
