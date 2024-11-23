import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { getExport } from "@/api/source";

const useSourceStore = defineStore("Source", () => {
  const state = reactive<StateProps>({
    data: [],
    total: 1,
    loading: false
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

  const loadingTarget = (bool: boolean) => {
    state.loading = bool;
  };

  return {
    state,
    initSoure,
    loadingTarget
  };
});

export default useSourceStore;
