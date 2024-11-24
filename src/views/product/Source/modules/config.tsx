import { computed, reactive, watch } from "vue";
import useSourceStore from "./store";
import type {
  AdaptiveConfig,
  LoadingConfig,
  PaginationProps
} from "@pureadmin/table";
import { delay } from "@pureadmin/utils";
import type { SourceTypes } from "@/api/source";
import { timeRenderContainer } from "@/components/Default/TimeColumns";

export function useColumns() {
  const sourceStore = useSourceStore();

  const total = computed(
    () => (sourceStore.$state && sourceStore.$state.state.total) || 1
  );

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

  const pagination = reactive<PaginationProps>({
    pageSize: 20,
    currentPage: 1,
    pageSizes: [20, 40, 60],
    total: 1,
    align: "center",
    background: false,
    size: "default"
  });

  const handleEdit = (row: SourceTypes) => {
    console.log("============", row);
  };

  const columns = reactive<TableColumnList>([
    {
      label: "文件名",
      prop: "fileName",
      showOverflowTooltip: true
    },
    {
      label: "备注",
      prop: "description",
      showOverflowTooltip: true
    },
    timeRenderContainer("createTime", "创建时间"),
    timeRenderContainer("updateTime", "更新时间"),
    {
      label: "操作选项",
      prop: "",
      width: "150px",
      fixed: "right",
      cellRenderer: ({ row }) => (
        <>
          <el-button
            type="primary"
            size="small"
            onClick={() => handleEdit(row)}
          >
            编辑
          </el-button>
        </>
      )
    }
  ]);

  function onSizeChange(val) {
    pagination.pageSize = val;

    sourceStore.initSoure({
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize
    });
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    sourceStore.loadingTarget(true);
    delay().then(() => {
      sourceStore.loadingTarget(false);
    });
    sourceStore.loadingTarget(false);
  }

  watch(total, newTotal => {
    pagination.total = newTotal;
  });

  return {
    columns,
    loadingConfig,
    adaptiveConfig,
    pagination,
    onSizeChange,
    onCurrentChange
  };
}
