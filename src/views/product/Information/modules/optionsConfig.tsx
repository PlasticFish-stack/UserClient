export function useOptionsColumns() {
  const columns: TableColumnList = [
    {
      label: "名称",
      prop: "name"
    },
    {
      label: "值",
      prop: "value",
      cellRenderer: ({ row }) => <el-input v-model={row.value} />
    }
  ];

  const optionsColumns = columns.map(item => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cellRenderer, ...args } = item;
    return args;
  });

  return {
    columns,
    optionsColumns
  };
}
