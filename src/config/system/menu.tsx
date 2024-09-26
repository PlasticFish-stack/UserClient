import type {
  AdaptiveConfig,
  LoadingConfig,
  PaginationProps
} from "@pureadmin/table";
import { delay } from "@pureadmin/utils";
import { formatGolangDate } from "@/utils/time/date";
import { reactive, ref } from "vue";
import type { Menu } from "@/api/menu";
import { ElPopconfirm } from "element-plus";
import { useMenuTableStore } from "@/store/modules/customise/menu";
export function useColumns() {
  const menuTableStore = useMenuTableStore();
  const display = ref(false);
  function displayTarget() {
    display.value = !display.value;
    console.log(display.value);
  }
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
    background: false,
    size: "default"
  });
  const handleEdit = (_index: number, row: Menu) => {
    menuTableStore.displayTarget();
    menuTableStore.rowDataInsert(row);
    menuTableStore.typeChange("edit");
  };
  const handleDelete = (_index: number, row: Menu) => {
    menuTableStore.DeleteMenu(row.menu_id);
  };
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
  const dataList = ref([]);
  const columns: TableColumnList = [
    {
      label: "菜单Id",
      prop: "menu_id"
    },
    {
      label: "菜单名",
      prop: "menu_name"
    },
    {
      label: "菜单简介",
      prop: "menu_desc"
    },
    {
      label: "菜单标识",
      prop: "menu_identifier"
    },
    {
      label: "菜单路径",
      prop: "menu_path"
    },
    {
      label: "菜单图标",
      prop: "menu_icon"
    },
    {
      label: "菜单模板",
      prop: "menu_path"
    },
    {
      label: "菜单排序",
      prop: "menu_sort"
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: ({ row }) => (
        <el-tag type={row.status ? "success" : "danger"}>
          {row.status ? "生效" : "失效"}
        </el-tag>
      )
    },
    {
      prop: "create_time",
      headerRenderer: () => (
        <div style="display: flex; justify-content: center; align-items: center;position: relative;">
          <div style="position: absolute; left:0">
            {/* <iconify-icon-online icon="ep:timer" /> */}
          </div>
          <div>
            <span>创建时间</span>
          </div>
        </div>
      ),
      cellRenderer: ({ row }) => (
        <div style="display: flex; justify-content: center;align-items: center">
          <span>{formatGolangDate(row.create_time)}</span>
        </div>
      )
    },
    {
      label: "更新时间",
      prop: "update_time",
      headerRenderer: () => (
        <div style="display: flex; justify-content: center; align-items: center;position: relative;">
          <div style="position: absolute; left:0">
            {/* <iconify-icon-online icon="ep:timer" /> */}
          </div>
          <div>
            <span>更新时间</span>
          </div>
        </div>
      ),
      cellRenderer: ({ row }) => (
        <div style="display: flex; justify-content: center;align-items: center">
          <span>{formatGolangDate(row.update_time)}</span>
        </div>
      )
    },
    {
      label: "操作选项",
      prop: "",
      cellRenderer: ({ index, row }) => (
        <>
          <el-button
            type="primary"
            size="small"
            onClick={() => handleEdit(index + 1, row)}
          >
            编辑
          </el-button>
          <ElPopconfirm
            width="220"
            title="是否要删除该角色"
            confirm-button-text="删除"
            cancel-button-text="返回"
            confirmButtonType="danger"
            onConfirm={() => handleDelete(index + 1, row)}
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
    console.log("onSizeChange", val);
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    menuTableStore.loadingTarget(true);
    delay().then(() => {
      menuTableStore.loadingTarget(false);
    });
    menuTableStore.loadingTarget(false);
  }
  return {
    columns,
    dataList,
    display,
    pagination,
    loadingConfig,
    adaptiveConfig,
    displayTarget,
    onSizeChange,
    onCurrentChange
  };
}