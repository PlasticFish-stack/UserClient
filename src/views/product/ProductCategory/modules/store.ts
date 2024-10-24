import { getCategory } from "@/api/productCategory";
import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { cloneDeep } from "@pureadmin/utils";
import { resetReactiveState } from "@/utils/globalUtils";

export const useProductCategoryStore = defineStore("ProductCategory", () => {
  const defaultState: StateProps = {
    categoryData: []
  };

  const state = reactive<StateProps>(cloneDeep(defaultState));

  const resetState = () => {
    resetReactiveState(state, defaultState);
  };

  const initCategory = async () => {
    const res = await getCategory();
    if (res.success) {
      state.categoryData = res.data;
      console.log("=========", res.data);
    }
  };

  return {
    state,
    initCategory,
    resetState
  };
});
