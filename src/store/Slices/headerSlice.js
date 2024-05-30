import { createSlice } from "@reduxjs/toolkit";

export const headerSlice = createSlice({
  name: "headerSlice",
  initialState: {
    lang: 2,
    prev_currency: "",
    currency: 2,
    currency_name: "EUR",
    currency_symbol: "€",
    lang_code: "ar",
    fetching: false,
    carSearching: false,
  },
  reducers: {
    langUpdate: (state, action) => {
      state.lang = action.payload.lang;
      state.lang_code = action.payload.lang_code;
    },
    preCurrencyUpdate: (state, action) => {
      state.prev_currency = action.payload.prev_currency;
    },
    currencyUpdate: (state, action) => {
      state.currency = action.payload.currency;
      state.currency_symbol = action.payload.currency_symbol;
      state.currency_name = action.payload.currency_name;
    },
    updateFetching: (state, action) => {
      state.fetching = action.payload;
    },
    listSearching: (state, action) => {
      state.carSearching = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { langUpdate, currencyUpdate, updateFetching, listSearching, preCurrencyUpdate } =
  headerSlice.actions;

export default headerSlice.reducer;
