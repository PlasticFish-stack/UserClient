import type {
  AdaptiveConfig,
  LoadingConfig,
  PaginationProps
} from "@pureadmin/table";
import { delay } from "@pureadmin/utils";
import { formatGolangDate } from "@/utils/time/date";
import { reactive } from "vue";
import { ElPopconfirm } from "element-plus";
import type { BrandTypes } from "@/api/brand";
import useInformationStore from "./store";

export function useColumns(informationFormRef) {
  const informationStore = useInformationStore();

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
    /* informationStore.initCurBrand(row);
    informationStore.typeChange("Edit");
    brandFormRef.value?.open(); */
  };

  const handleDelete = (row: BrandTypes) => {
    const { id } = row;
    /*  informationStore.deleteBrand([
      {
        id
      }
    ]); */
  };

  const columns: TableColumnList = [
    {
      label: "货号",
      prop: "itemNumber",
      width: "150px"
    },
    {
      label: "sku",
      prop: "sku",
      width: "100px"
    },
    {
      label: "spu",
      prop: "spu",
      width: "100px"
    },
    {
      label: "数量",
      prop: "quantity",
      width: "150px"
    },
    {
      label: "规格",
      prop: "specifications",
      width: "150px"
    },
    {
      label: "条形码",
      prop: "barcode",
      width: "150px"
    },
    {
      label: "海关编码",
      prop: "customscode",
      width: "150px"
    },
    {
      label: "描述",
      prop: "description",
      width: "150px"
    },
    {
      label: "颜色",
      prop: "color",
      width: "150px"
    },
    {
      label: "类型",
      prop: "typeName",
      width: "150px"
    },
    {
      label: "描述",
      prop: "description",
      width: "150px"
    },
    timeRenderContainer("updateTime", "更新时间"),
    timeRenderContainer("createTime", "创建时间"),
    /* {
      label: "成本价表",
      prop: "costs"
    },
    {
      label: "产品字段",
      prop: "options"
    }, */
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
    /* informationStore.loadingTarget(true);
    delay().then(() => {
      informationStore.loadingTarget(false);
    });
    informationStore.loadingTarget(false); */
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