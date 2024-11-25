import { type CategoryTypes, getCategory } from "@/api/productCategory";
import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { cloneDeep } from "@pureadmin/utils";
import { resetReactiveState } from "@/utils/globalUtils";

export const useProductCategoryStore = defineStore("ProductCategory", () => {
  const defaultState: StateProps = {
    categoryData: [],
    loading: false,
    edit: false,
    curCategory: null
  };

  const state = reactive<StateProps>(cloneDeep(defaultState));

  const resetState = () => {
    resetReactiveState(state, defaultState);
  };

  const initCategory = async () => {
    const res = await getCategory();
    if (res.success) {
      state.categoryData = res.data.data;
    }
  };

  const loadingTarget = (bool: boolean) => {
    state.loading = bool;
  };
  const editTarget = (bool: boolean) => {
    state.edit = bool;
  };

  const curCategoryChange = (row: CategoryTypes) => {
    state.curCategory = row;
  };

  return {
    state,
    initCategory,
    resetState,
    loadingTarget,
    curCategoryChange,
    editTarget
  };
});
