import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { getInformation, handleInformationDelete } from "@/api/information";
import { successMes } from "@/utils/globalReqMes";

const useInformationStore = defineStore("Information", () => {
  const state = reactive<StateProps>({
    loading: false,
    informationData: [],
    curInformation: null,
    type: "Add"
  });

  const initInformation = async () => {
    state.loading = true;
    const res = await getInformation({
      pageNum: 1,
      pageSize: 10
    });
    state.informationData = res.data.data;
    console.log("==========", res.data.data);
    state.loading = false;
  };

  const initCurInformation = row => {
    state.curInformation = row;
  };

  const typeChange = (type: StateProps["type"]) => {
    state.type = type;
  };

  const loadingTarget = (bool: boolean) => {
    state.loading = bool;
  };

  const deleteInformation = async row => {
    const res = await handleInformationDelete(row);

    if (res.success) {
      successMes(res.data);

      initInformation();
    }
  };

  return {
    state,
    initInformation,
    initCurInformation,
    typeChange,
    loadingTarget,
    deleteInformation
  };
});

export default useInformationStore;
