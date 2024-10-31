export function useFieldColumns() {
  const columns: TableColumnList = [
    {
      label: "名称",
      prop: "name",
      cellRenderer: ({ row }) => <el-input v-model={row.name} />
    },
    {
      label: "别称",
      prop: "nickname",
      cellRenderer: ({ row }) => <el-input v-model={row.nickname} />
    },
    {
      label: "操作",
      fixed: "right",
      width: 70,
      slot: "operation"
    }
  ];

  return {
    columns
  };
}
