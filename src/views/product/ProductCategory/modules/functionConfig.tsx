import type { CategoryFormulasTypes } from "@/api/productCategory";

export function useColumns() {
  const columns: TableColumnList = [
    {
      label: "姓名",
      prop: "name",
      cellRenderer: ({ row }) => <el-input v-model={row.name} />
    },
    {
      label: "别名",
      prop: "nickname",
      cellRenderer: ({ row }) => <el-input v-model={row.nickname} />
    },
    {
      label: "函数",
      prop: "formula",
      cellRenderer: ({ row }) => <el-input v-model={row.formula} />
    },
    {
      label: "预览值",
      prop: "previewValue",
      cellRenderer: ({ row }) => (
        <el-input-number
          v-model={row.previewValue}
          size="small"
          controls-position="right"
        />
      )
    },
    {
      label: "预览",
      prop: "preview",
      cellRenderer: ({ row }) => computedPreviewValue(row)
    }
  ];

  function computedPreviewValue(row: CategoryFormulasTypes) {
    try {
      const n = row["previewValue"];
      if (!n || typeof n !== "number") return "-";
      const expression = row.formula;
      let result = eval(expression.replace(/n/g, String(n)));
      return Math.round(result * 100) / 100 + "%";
    } catch (err) {
      return "-";
    }
  }

  const getRandomFormulas = () => {
    return [
      Math.floor(Math.random() * 1000),
      Math.floor(Math.random() * 1000),
      Math.floor(Math.random() * 1000)
    ].map(key => ({
      key,
      name: "",
      nickname: "",
      formula: "",
      previewValue: 100
    }));
  };

  return {
    columns,
    getRandomFormulas
  };
}
