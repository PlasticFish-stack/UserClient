import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { getInformation } from "@/api/information";

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

  return {
    state,
    initInformation,
    initCurInformation,
    typeChange
  };
});

export default useInformationStore;
