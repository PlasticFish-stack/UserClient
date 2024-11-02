import { http } from "@/utils/http";

export type BrandTypes = {
  id: number;
  createTime: Date;
  updateTime: Date;
  name: string;
  description: string;
  Products: number;
};

export type BrandResult = {
  success: boolean;
  data: Array<BrandTypes>;
};
export type BrandReqResult = {
  success: boolean;
  data: string;
};

export const getBrand = () => {
  return http.request<BrandResult>("get", "/product/brand/getall");
};

export const handleBrandAdd = data => {
  return http.request<BrandReqResult>("post", "/product/brand/add", {
    data
  });
};
export const handleBrandUpdate = data => {
  return http.request<BrandReqResult>("post", "/product/brand/update", {
    data
  });
};

export const handleBrandDelete = data => {
  return http.request<BrandReqResult>("post", "/product/brand/delete", {
    data
  });
};
