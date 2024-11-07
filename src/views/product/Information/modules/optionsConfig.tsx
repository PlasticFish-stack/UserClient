export function useOptionsColumns() {
  const columns: TableColumnList = [
    {
      label: "名称",
      prop: "name"
    },
    {
      label: "值",
      prop: "value",
      cellRenderer: ({ row }) => <el-input v-model={row.nickname} />
    }
  ];

  return {
    columns
  };
}
