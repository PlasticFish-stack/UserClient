import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { getExport } from "@/api/source";
import { getCategory } from "@/api/productCategory";
import {
  recursionCategory,
  recursionCategoryAddOptions
} from "@/utils/globalUtils";
import { getBrand } from "@/api/brand";

const useSourceStore = defineStore("Source", () => {
  const state = reactive<StateProps>({
    data: [],
    total: 1,
    loading: false,
    categoryData: [],
    brandData: [],
    categoryMapping: {},
    brandMapping: {}
  });

  const initSoure = async ({
    pageNum = 1,
    pageSize = 20
  }: {
    pageNum: number;
    pageSize: number;
  }) => {
    state.loading = true;
    const res = await getExport({ pageNum, pageSize });

    state.data = res.data.data;
    state.total = res.data.limits.total;
    state.loading = false;
  };

  const initCategory = async () => {
    const categoryRes = await getCategory();
    state.categoryData = recursionCategoryAddOptions(
      categoryRes.data.data || []
    );
    state.categoryMapping = recursionCategory(state.categoryData);
  };

  const initBrand = async () => {
    const brandRes = await getBrand();

    state.brandData = brandRes.data.map(item => ({
      ...item,
      label: item.name,
      value: item.id
    }));
    state.brandMapping = recursionCategory(state.brandData);
  };

  const init = ({
    pageNum = 1,
    pageSize = 10
  }: {
    pageNum: number;
    pageSize: number;
  }) => {
    initSoure({
      pageNum,
      pageSize
    });
    initCategory();
    initBrand();
  };

  const loadingTarget = (bool: boolean) => {
    state.loading = bool;
  };

  return {
    state,
    init,
    initSoure,
    loadingTarget
  };
});

export default useSourceStore;
