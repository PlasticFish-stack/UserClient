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
  data: Array<CategoryTypes>;
};

export const getCategory = () => {
  return http.request<CategoryResult>("get", "/product/type/getall");
};
