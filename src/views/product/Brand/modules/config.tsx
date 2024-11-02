import type {
  AdaptiveConfig,
  LoadingConfig,
  PaginationProps
} from "@pureadmin/table";
import { delay } from "@pureadmin/utils";
import { formatGolangDate } from "@/utils/time/date";
import { reactive } from "vue";
import { ElPopconfirm } from "element-plus";

import useBrandStore from "./store";
import type { BrandTypes } from "@/api/brand";

export function useColumns(brandFormRef) {
  const brandStore = useBrandStore();
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

  const timeRenderContainer = (key: string, title: string): any => {
    return {
      prop: key,
      headerRenderer: () => (
        <div style="display: flex; justify-content: center; align-items: center;position: relative;">
          <div style="position: absolute; left:0">
            {/* <iconify-icon-online icon="ep:timer" /> */}
          </div>
          <div>
            <span>{title}</span>
          </div>
        </div>
      ),
      cellRenderer: ({ row }) => (
        <div style="display: flex; justify-content: center;align-items: center">
          <span>{formatGolangDate(row[key])}</span>
        </div>
      )
    };
  };

  const handleEdit = (row: BrandTypes) => {
    brandStore.initCurBrand(row);
    brandStore.typeChange("Edit");
    brandFormRef.value?.open();
  };

  const handleDelete = (row: BrandTypes) => {
    const { id } = row;
    brandStore.deleteBrand([
      {
        id
      }
    ]);
  };

  const columns: TableColumnList = [
    {
      label: "用户名",
      prop: "name"
    },
    {
      label: "昵称",
      prop: "description"
    },
    timeRenderContainer("updateTime", "更新时间"),
    timeRenderContainer("createTime", "创建时间"),
    {
      label: "操作选项",
      prop: "",
      cellRenderer: ({ row }) => (
        <>
          <el-button
            type="primary"
            size="small"
            onClick={() => {
              handleEdit(row);
            }}
          >
            编辑
          </el-button>
          <ElPopconfirm
            width="220"
            title="是否要删除该用户"
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
  ];

  function onSizeChange(val) {
    console.log("onSizeChange=====", val);
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    brandStore.loadingTarget(true);
    delay().then(() => {
      brandStore.loadingTarget(false);
    });
    brandStore.loadingTarget(false);
  }
  return {
    columns,
    pagination,
    loadingConfig,
    adaptiveConfig,
    onSizeChange,
    onCurrentChange
  };
}
