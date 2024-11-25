import { http } from "@/utils/http";
import type { LimitsTypes } from "./types";
import { errorMes } from "@/utils/globalReqMes";

export type SourceTypes = {
  id: number;
  createTime: Date;
  updateTime: Date;
  /* 文件名 */
  fileName: string;
  /* 备注 */
  description: string;
  /* 成本价表 */
  costs?: any;
};

export type SourceResult = {
  success: boolean;
  data: {
    data: Array<SourceTypes>;
    limits: LimitsTypes;
  };
};
export type SourceReqResult = {
  success: boolean;
  data: string;
};

/* 获取模板 */
export const downloadExortDemo = async data => {
  try {
    const response = await http.request("post", "/excel/export", {
      data,
      responseType: "blob"
    });
    // 创建一个Blob对象并生成一个可下载的链接
    const url = window.URL.createObjectURL(new Blob([response as BlobPart]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "demo.xlsx"); // 设置下载文件名

    // 将链接添加到DOM中并模拟点击
    document.body.appendChild(link);
    link.click();

    // 清理：移除链接并释放URL对象
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    if (!e.response.headers["content-disposition"]) {
      const fileReader: any = new FileReader();
      fileReader.readAsText(
        new Blob([e.response.data], { type: "application/octet-stream" }),
        "utf-8"
      );
      fileReader.onload = () => {
        const result = JSON.parse(fileReader.result);
        errorMes(result.data.error);
      };
    }
    return false;
  }
};

export const getExport = params => {
  return http.request<SourceResult>("get", "/excel/getlimits", { params });
};
