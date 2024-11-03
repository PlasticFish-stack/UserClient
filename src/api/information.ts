import { http } from "@/utils/http";

export type InformationTypes = {
  id: number;
  createTime: Date;
  updateTime: Date;
  /* 货号 */
  itemNumber: string;
  /* 品牌id */
  brandId: number;
  /* sku */
  sku: string;
  /* spu */
  spu: string;
  /* 数量 */
  quantity: number;
  /* 规格 */
  specifications: string;
  /* 条形码 */
  barcode: string;
  /* 海关编码 */
  customscode: string;
  /* 描述 */
  description: string;
  /* 颜色 */
  color: string;
  /* 类型id */
  typeId: number;
  /* 类型 */
  typeName: string;
  /* 成本价表 */
  costs: any[];
  /* 产品字段 */
  options: {
    [key: string]: string;
  };
};

export type LimitsTypes = {
  total: number;
  pageSize: number;
  pageNum: number;
  pages: number;
};

export type InformationResult = {
  success: boolean;
  data: {
    data: Array<InformationTypes>;
    limits: LimitsTypes;
  };
};
export type InformationReqResult = {
  success: boolean;
  data: string;
};

export const getInformation = () => {
  return http.request<InformationResult>("get", "/product/product/getlimits", {
    data: {
      pageSize: 15,
      pageNum: 1
    }
  });
};
