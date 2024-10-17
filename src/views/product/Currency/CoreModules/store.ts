import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { getCurrency } from "@/api/currency";

export const useCurrencyStore = defineStore("currency", () => {
  const store = reactive<StateProps>({
    currencyData: []
  });

  const initCurrency = async () => {
    const res = await getCurrency();
    if (res.success) {
      store.currencyData = res.data;

      console.log(
        "==========",
        res.data.map(item => item.countryIcon)
      );
    }
  };

  return {
    store,

    initCurrency
  };
});
