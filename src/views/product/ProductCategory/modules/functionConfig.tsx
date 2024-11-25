import type { CategoryFormulasTypes } from "@/api/productCategory";
import { QuestionFilled } from "@element-plus/icons-vue";

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
      cellRenderer: ({ row }) => <el-input v-model={row.formula} />,
      headerRenderer: () => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <span>函数</span>
          <el-tooltip
            effect="dark"
            placement="top-start"
            v-slots={{
              content: () => (
                <>
                  <div>例:n为实际数额 </div>
                  <div>例:n + 1,预览值填1时,值为2 </div>
                  <div>例:n + n * 20%,预览值为1时，值为1.2</div>
                </>
              )
            }}
          >
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
      )
    },
    {
      label: "n 值",
      prop: "previewValue",
      cellRenderer: ({ row }) => {
        return (
          <el-input-number
            v-model={row.previewValue}
            size="small"
            controls-position="right"
          />
        );
      }
    },
    {
      label: "预览",
      width: 70,
      prop: "preview",
      cellRenderer: ({ row }) => computedPreviewValue(row)
    },
    {
      label: "操作",
      fixed: "right",
      width: 70,
      slot: "operation"
    }
  ];

  const checkFormula = formula => {
    const regex = /\b(const|let|var|function)\b/;
    return regex.test(formula);
  };

  function computedPreviewValue(row: CategoryFormulasTypes) {
    try {
      if (row.formula.indexOf("n") === -1) return "-";
      const n = row["previewValue"];
      if (!n || typeof n !== "number") return "-";
      const expression = row.formula;

      if (checkFormula(expression)) return "???";

      let result = eval(expression.replace(/n/g, String(n)));
      return String(Math.round(result * 100) / 100);
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
