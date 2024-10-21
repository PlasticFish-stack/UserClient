import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { getCurrency } from "@/api/currency";

export const useCurrencyStore = defineStore("currency", () => {
  const store = reactive<StateProps>({
    currencyData: [],
    rowData: null
  });

  const initCurrency = async () => {
    const res = await getCurrency();
    if (res.success) {
      store.currencyData = res.data;
    }
  };

  return {
    store,

    initCurrency
  };
});
