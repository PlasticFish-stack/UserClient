import { defineStore } from "pinia";
import { reactive } from "vue";
import { StateProps } from "./types";
import { getInformation } from "@/api/information";

const useInformationStore = defineStore("Information", () => {
  const state = reactive<StateProps>({
    loading: false,
    informationData: []
  });

  const initInformation = async () => {
    state.loading = true;
    const res = await getInformation();
    state.informationData = res.data.data;
    state.loading = false;
  };

  return {
    state,
    initInformation
  };
});

export default useInformationStore;
