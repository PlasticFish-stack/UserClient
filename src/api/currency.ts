import { http } from "@/utils/http";

export type CurrencyTypes = {
  id: number;
  cost: string;
  createTime: Date;
  updateTime: Date;
  apiUpdateTime: Date;
  countryIcon: string;
  currencyName: string;
  descriptionCn: string;
  descriptionEn: string;
};

interface CurrencyResult {
  success: boolean;
  data: CurrencyTypes[];
}

export const getCurrency = () => {
  return http.request<CurrencyResult>("get", "/rate/get");
};

export const synchronousCurrency = () => {
  return http.request<CurrencyResult>("post", "/rate/getapi");
};

export const updateCurrency = (data: any) => {
  return http.request<CurrencyResult>("post", "/rate/update", { data });
};
