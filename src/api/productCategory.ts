import { http } from "@/utils/http";

export type CategoryFieldsTypes = {
  id: number;
  createTime: Date;
  updateTime: Date;
  name: string;
  nickname: string;
  TypeId: number;
};

export type CategoryFormulasTypes = {
  id: number;
  createTime: Date;
  updateTime: Date;
  name: string;
  nickname: string;
  formula: string;
  TypeId: number;
};

export type CategoryTypes = {
  id: number;
  createTime: Date;
  updateTime: Date;
  name: string;
  description: string;
  sort: number;
  parentId: number;
  tax: number;
  fields: Array<CategoryFieldsTypes>;
  formulas: Array<CategoryFormulasTypes>;
  children: Array<CategoryTypes>;
};

export type CategoryResult = {
  success: boolean;
  data: {
    data: Array<CategoryTypes>;
  };
};
export type CategoryReqResult = {
  success: boolean;
  data: string;
};

export const getCategory = () => {
  return http.request<CategoryResult>("get", "/product/type/getall");
};

export const handleProductCategoryUpdate = data => {
  return http.request<CategoryReqResult>("post", "product/type/update", {
    data
  });
};

export const handleProductCategoryAdd = data => {
  return http.request<CategoryReqResult>("post", "product/type/add", { data });
};

export const handleProductCategoryDelete = data => {
  return http.request<CategoryReqResult>("post", "product/type/delete", {
    data
  });
};
