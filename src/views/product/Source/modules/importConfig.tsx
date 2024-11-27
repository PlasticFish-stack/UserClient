import type { PlusColumn } from "plus-pro-components";

const useColumns = () => {
  const rules = {
    fileName: [
      {
        required: true,
        message: "请输入文件名"
      }
    ],
    description: [
      {
        required: true,
        message: "请输入描述"
      }
    ]
  };

  const columns: PlusColumn[] = [
    {
      label: "文件名",
      prop: "fileName",
      valueType: "input"
    },
    {
      label: "描述",
      prop: "description",
      valueType: "input"
    }
  ];

  return {
    columns,
    rules
  };
};

export default useColumns;
