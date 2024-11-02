import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { getBrand, handleBrandDelete } from "@/api/brand";
import { successMes } from "@/utils/globalReqMes";

const useBrandStore = defineStore("Brand", () => {
  const state = reactive<StateProps>({
    brandData: [],
    loading: false,
    type: "Add",
    curBrand: null
  });

  const initBrand = async () => {
    const res = await getBrand();
    state.brandData = res.data;
  };

  const loadingTarget = (bool: boolean) => {
    state.loading = bool;
  };

  const typeChange = (type: StateProps["type"]) => {
    state.type = type;
  };

  const initCurBrand = row => {
    state.curBrand = row;
  };

  const deleteBrand = async data => {
    const res = await handleBrandDelete(data);
    initBrand();
    successMes(res.data);
  };

  return {
    state,
    initBrand,
    loadingTarget,
    typeChange,
    initCurBrand,
    deleteBrand
  };
});

export default useBrandStore;
