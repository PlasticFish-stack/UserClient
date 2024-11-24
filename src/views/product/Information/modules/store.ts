import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { StateProps } from "./types";
import { getInformation, handleInformationDelete } from "@/api/information";
import { successMes } from "@/utils/globalReqMes";
import { getCategory } from "@/api/productCategory";
import { getBrand } from "@/api/brand";
import { useColumns } from "./config";
import { cloneDeep } from "@pureadmin/utils";
import {
  recursionCategory,
  recursionCategoryAddOptions,
  resetReactiveState
} from "@/utils/globalUtils";

const useInformationStore = defineStore("Information", () => {
  const { pagination } = useColumns(null, null);

  const defaultForm = {
    itemNumber: "",
    typeId: "",
    brandId: "",
    createTimeRange: [],
    updateTimeRange: []
  };

  const state = reactive<StateProps>({
    loading: false,
    informationData: [],
    curInformation: null,
    type: "Add",
    categoryData: [],
    brandData: [],
    categoryMapping: {},
    brandMapping: {},
    total: 1
  });

  const form = ref(cloneDeep(defaultForm));

  const handleSearchParams = () => {
    const params = {};
    Object.keys(form.value).forEach(key => {
      if (typeof form.value[key] !== "number" && form.value[key]) {
        if (
          ["itemNumber", "keyword", "typeId", "brandId"].includes(key) &&
          typeof form.value[key] !== "number" &&
          form.value[key]
        ) {
          params[key] = form.value[key];
        } else if (
          Array.isArray(form.value[key]) &&
          form.value[key].length === 2
        ) {
          if ("createTimeRange" === key) {
            params["startCreateTime"] = form.value[key][0] || "";
            params["endCreateTime"] = form.value[key][1] || "";
          } else if ("updateTimeRange" === key) {
            params["startUpdateTime"] = form.value[key][0] || "";
            params["endUpdateTime"] = form.value[key][1] || "";
          }
        }
      }
    });

    return params;
  };

  const initInformation = async ({
    pageNum = 1,
    pageSize = 10
  }: {
    pageNum: number;
    pageSize: number;
  }) => {
    state.loading = true;
    const res = await getInformation({
      pageNum,
      pageSize,
      ...handleSearchParams()
    });
    state.informationData = res.data.data;
    state.loading = false;

    state.total = res.data.limits.total;
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
    initInformation({
      pageNum,
      pageSize
    });
    initCategory();
    initBrand();
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
      initInformation({
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize
      });
    }
  };

  const handleFormChange = values => {
    form.value = values;
  };

  const handelReset = () => {
    resetReactiveState(form.value, defaultForm);
  };

  return {
    state,
    form,
    initInformation,
    initCurInformation,
    typeChange,
    loadingTarget,
    deleteInformation,
    initCategory,
    initBrand,
    init,
    handleFormChange,
    handelReset
  };
});

export default useInformationStore;
