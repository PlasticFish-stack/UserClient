import { reactive } from "vue";

export function useCostsColumns() {
  const indexMethod = (index: number) => {
    return index + 1;
  };

  const expandColumns = reactive<TableColumnList>([
    {
      type: "index",
      index: indexMethod
    },
    {
      label: "表格名称",
      prop: "excelLogId"
    },
    {
      label: "成本价",
      prop: "cost"
    },
    {
      label: "货币名称",
      prop: "currencyName"
    },
    {
      label: "货币税率",
      prop: "currencyCost"
    }
  ]);

  return {
    expandColumns
  };
}
