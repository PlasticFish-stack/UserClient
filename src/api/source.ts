import { http } from "@/utils/http";

export const getExport = data => {
  return http
    .request("post", "/excel/export", { data, responseType: "blob" })
    .then(response => {
      console.log("==========", response);
      // 创建一个Blob对象并生成一个可下载的链接
      const url = window.URL.createObjectURL(new Blob([response as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "filename.xlsx"); // 设置下载文件名

      // 将链接添加到DOM中并模拟点击
      document.body.appendChild(link);
      link.click();

      // 清理：移除链接并释放URL对象
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error("下载文件时发生错误:", error);
    });
};
