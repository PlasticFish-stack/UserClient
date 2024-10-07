import { ElMessage } from "element-plus";

export const successMes = (sucCopywriting: string = "更新成功！") => {
  ElMessage({
    message: sucCopywriting,
    type: "success"
  });
};
