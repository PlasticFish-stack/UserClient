import { message } from "./message";

export const successMes = (sucCopywriting: string = "更新成功！") => {
  message(sucCopywriting, {
    customClass: "el",
    type: "success"
  });
};

export const errorMes = (sucCopywriting: string = "更新失败！") => {
  message(sucCopywriting, {
    customClass: "el",
    type: "error"
  });
};
