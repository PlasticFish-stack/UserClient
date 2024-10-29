import { reactive, ref } from "vue";
import { useProductCategoryStore } from "./store";
import type {
  AdaptiveConfig,
  LoadingConfig,
  PaginationProps
} from "@pureadmin/table";
import { ElPopconfirm } from "element-plus";
import { formatGolangDate } from "@/utils/time/date";
import { delay } from "@pureadmin/utils";
import type {
  CategoryFormulasTypes,
  CategoryTypes
} from "@/api/productCategory";

export function useColumns(categoryRef) {
  const categoryStore = useProductCategoryStore();
  const edit = ref(false);

  const loadingConfig = reactive<LoadingConfig>({
    text: "正在加载第一页...",
    viewBox: "-10, -10, 50, 50",
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
    // svg: "",
    // background: rgba()
  });
  const pagination = reactive<PaginationProps>({
    pageSize: 20,
    currentPage: 1,
    pageSizes: [20, 40, 60],
    total: 1,
    align: "center",
    background: true,
    size: "default"
  });

  const adaptiveConfig: AdaptiveConfig = {
    /** 表格距离页面底部的偏移量，默认值为 `96` */
    offsetBottom: 80
    /** 是否固定表头，默认值为 `true`（如果不想固定表头，fixHeader设置为false并且表格要设置table-layout="auto"） */
    // fixHeader: true
    /** 页面 `resize` 时的防抖时间，默认值为 `60` ms */
    // timeout: 60
    /** 表头的 `z-index`，默认值为 `100` */
    // zIndex: 100
  };

  const indexMethod = (index: number) => {
    return index + 1;
  };

  const targetScript = (row: CategoryTypes, f: CategoryFormulasTypes) => {
    const tax = String(row.tax);
    const script = f.formula.replace(/n/g, tax);
    if (!script) return NaN;

    return eval(script) + "%";
  };

  const onSizeChange = val => {
    console.log("onSizeChange", val);
  };

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    categoryStore.loadingTarget(true);
    delay().then(() => {
      categoryStore.loadingTarget(false);
    });
    categoryStore.loadingTarget(false);
  }

  const columns = reactive<TableColumnList>([
    {
      type: "index",
      index: indexMethod
    },
    {
      label: "类别名称",
      prop: "name",
      headerAlign: "left",
      align: "left"
    },
    {
      label: "类别简介",
      prop: "description",
      align: "left"
    },
    {
      label: "汇率",
      headerAlign: "center",
      prop: "tax",
      align: "center",
      cellRenderer: ({ row }) => (
        <>
          {row.formulas.length === 0 ? (
            <el-tag type="success">汇率</el-tag>
          ) : (
            row.formulas.map(f => (
              <el-tag
                type="success"
                key={f.id}
                style={{
                  marginLeft: "4px"
                }}
              >
                {`${f.nickname}：${targetScript(row, f)}`}
              </el-tag>
            ))
          )}
        </>
      )
    },
    {
      prop: "createTime",
      width: 180,
      headerRenderer: () => (
        <div style="display: flex; justify-content: center; align-items: center;position: relative;">
          <div style="position: absolute; left:0"></div>
          <div>
            <span>创建时间</span>
          </div>
        </div>
      ),
      cellRenderer: ({ row }) => (
        <div style="display: flex; justify-content: center;align-items: center">
          <span>{formatGolangDate(row.createTime)}</span>
        </div>
      )
    },
    {
      prop: "updateTime",
      width: 180,
      headerRenderer: () => (
        <div style="display: flex; justify-content: center; align-items: center;position: relative;">
          <div style="position: absolute; left:0"></div>
          <div>
            <span>更新时间</span>
          </div>
        </div>
      ),
      cellRenderer: ({ row }) => (
        <div style="display: flex; justify-content: center;align-items: center">
          <span>{formatGolangDate(row.updateTime)}</span>
        </div>
      )
    },
    {
      label: "操作选项",
      prop: "",
      align: "center",
      headerAlign: "center",
      width: 260,
      cellRenderer: ({ row }) => (
        <>
          <el-button type="success" size="small" onClick={() => handleAdd(row)}>
            新增子类别
          </el-button>
          <el-button
            type="primary"
            size="small"
            onClick={() => handleEdit(row)}
          >
            编辑
          </el-button>
          <ElPopconfirm
            width="220"
            title="是否要删除该类别"
            confirm-button-text="删除"
            cancel-button-text="返回"
            confirmButtonType="danger"
            onConfirm={() => handleDelete(row)}
            v-slots={{
              reference: () => (
                <el-button type="danger" size="small">
                  {" "}
                  删除
                </el-button>
              )
            }}
          ></ElPopconfirm>
        </>
      )
    }
  ]);

  function handleAdd(row: CategoryTypes) {
    const { parentId } = row;
    categoryStore.curCategoryChange(row);
    categoryRef.value.open({
      parentId
    });
  }

  function handleEdit(row: CategoryTypes) {
    categoryStore.curCategoryChange(row);
    categoryStore.editTarget(true);
    categoryRef.value.open(row);
  }
  function handleDelete(row: CategoryTypes) {
    console.log("=========", row);
  }

  return {
    columns,
    edit,
    loadingConfig,
    pagination,
    adaptiveConfig,
    onSizeChange,
    onCurrentChange
  };
}
