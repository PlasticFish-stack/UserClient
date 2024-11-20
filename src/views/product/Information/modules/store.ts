import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StateProps } from "./types";
import { getInformation, handleInformationDelete } from "@/api/information";
import { successMes } from "@/utils/globalReqMes";
import { getCategory } from "@/api/productCategory";
import { getBrand } from "@/api/brand";

const useInformationStore = defineStore("Information", () => {
  const state = reactive<StateProps>({
    loading: false,
    informationData: [],
    curInformation: null,
    type: "Add",
    categoryData: [],
    brandData: [],
    categoryMapping: {},
    brandMapping: {}
  });

  const initInformation = async () => {
    state.loading = true;
    const res = await getInformation({
      pageNum: 1,
      pageSize: 10
    });
    state.informationData = res.data.data;
    state.loading = false;
  };

  /**
   * 初始化处理 产品类别、品牌基础数据
   */
  // 递归读取名称
  const recursionCategory = list => {
    return list.reduce((pre, cur) => {
      pre = {
        ...pre,
        [cur.id]: cur
      };
      if (cur.children) {
        return {
          ...pre,
          ...recursionCategory(cur.children)
        };
      }
      return pre;
    }, {});
  };
  const recursionCategoryAddOptions = list => {
    return list.reduce((pre, cur) => {
      pre = [
        ...pre,
        {
          ...cur,
          label: cur.name,
          value: cur.id,
          children: recursionCategoryAddOptions(cur.children || [])
        }
      ];
      return pre;
    }, []);
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

  const init = () => {
    initInformation();
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

      initInformation();
    }
  };

  return {
    state,
    initInformation,
    initCurInformation,
    typeChange,
    loadingTarget,
    deleteInformation,
    initCategory,
    initBrand,
    init
  };
});

export default useInformationStore;
