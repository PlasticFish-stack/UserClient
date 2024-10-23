import { defineStore } from "pinia";
import { reactive } from "vue";

export const useProductCategoryStore = defineStore("ProductCategory", () => {
  const state = reactive({});

  return {
    state
  };
});
