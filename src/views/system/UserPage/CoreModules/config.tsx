import type {
  AdaptiveConfig,
  LoadingConfig,
  PaginationProps
} from "@pureadmin/table";
import { delay } from "@pureadmin/utils";
import { formatGolangDate } from "@/utils/time/date";
import { reactive, ref } from "vue";
import { ElPopconfirm } from "element-plus";
import { useUserTableStore } from "./store";
import type { User } from "./types";
export function useColumns() {
  const userTableStore = useUserTableStore();
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
  const handleEdit = (_index: number, row: User) => {
    userTableStore.displayTarget();
    userTableStore.rowDataInsert(row);
    userTableStore.typeChange("edit");
  };
  const handleDelete = (_index: number, row: User) => {
    const { id, name } = row;
    userTableStore.DeleteRole({
      id,
      name
    });
  };

  const handleBingMenu = (row: User) => {
    const ref = userTableStore.$state.userRoleDialogRef;
    ref.open();
    userTableStore.rowDataInsert(row);
  };

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
      label: "用户名",
      prop: "name"
    },
    {
      label: "昵称",
      prop: "nickname"
    },
    {
      label: "头像",
      prop: "avatar",
      cellRenderer: ({ row }) => {
        const checkImgUrl = (row.avatar as string).indexOf("http") === 0;
        return (
          <div class="avatar-warpper">
            {checkImgUrl && <img src={row.avatar} alt="" class="user-avatar" />}
          </div>
        );
      }
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
    timeRenderContainer("lastLoginTime", "上次登录时间"),
    timeRenderContainer("updateTime", "更新时间"),
    timeRenderContainer("createTime", "创建时间"),
    {
      label: "操作选项",
      prop: "",
      cellRenderer: ({ index, row }) => (
        <>
          <el-button
            type="primary"
            size="small"
            onClick={() => {
              handleEdit(index + 1, row);
            }}
          >
            编辑
          </el-button>
          <el-button
            type="success"
            size="small"
            onClick={() => handleBingMenu(row)}
          >
            绑定
          </el-button>
          <ElPopconfirm
            width="220"
            title="是否要删除该用户"
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
    console.log("onSizeChange=====", val);
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    userTableStore.loadingTarget(true);
    delay().then(() => {
      userTableStore.loadingTarget(false);
    });
    userTableStore.loadingTarget(false);
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
