// import { dateFormat } from "@pureadmin/utils";

export const formatGolangDate = (date: string) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("时间格式错误");
  }
  const year = parsedDate.getUTCFullYear();
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
  const day = String(parsedDate.getUTCDate()).padStart(2, "0");
  const hours = String(parsedDate.getUTCHours()).padStart(2, "0");
  const minutes = String(parsedDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(parsedDate.getUTCSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
};
