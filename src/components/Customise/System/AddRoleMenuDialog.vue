<template>
  <PlusDialogForm
    v-model:visible="state.visible"
    v-model="state.formData"
    title="角色菜单绑定"
    style="border-radius: 8px"
    :form="{ columns }"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #plus-field-menuIds>
      <pure-table
        ref="tableRef"
        row-key="id"
        :data="state.menuData"
        :columns="tableColumns"
        :border="true"
        :select-on-indeterminate="true"
        default-expand-all
        :tree-props="{
          hasChildren: 'hasChildren',
          children: 'children',
          checkStrictly: true
        }"
        @selection-change="handleSelectionChange"
        @select="select"
        @select-all="selectAll"
      />
    </template>

    <template #dialog-footer="{ handleConfirm, handleCancel }">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
    </template>
  </PlusDialogForm>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";
import { cloneDeep } from "@pureadmin/utils";
import { getBindMenu, Role, updateRoleMenu } from "@/api/role";
import { getMenu, Menu } from "@/api/menu";
import { resetReactiveState } from "@/utils/globalUtils";
import { successMes } from "@/utils/globalReqMes";

interface stateProps {
  columns: PlusColumn[];
  menuData: any[];
  visible: boolean;
  formData:
    | {
        name: string;
        menuIds: Menu[];
      }
    | FieldValues;
  curRoleMes: Role;
  confirmLoading: boolean;
}

const columns: PlusColumn[] = [
  {
    label: "角色名称",
    prop: "name",
    valueType: "input",
    fieldProps: {
      disabled: true
    }
  },
  {
    label: "菜单绑定",
    prop: "menuIds",
    valueType: "tree-select"
  }
];

const tableColumns: TableColumnList = [
  {
    type: "selection",
    align: "center"
  },
  {
    label: "菜单名称",
    prop: "name"
  },
  {
    label: "菜单简介",
    prop: "description"
  },
  {
    label: "菜单标识",
    prop: "identifier"
  }
];

const defaultState: stateProps = {
  columns: cloneDeep(columns),
  menuData: [],
  visible: false,
  formData: {
    name: "",
    menuIds: []
  },
  curRoleMes: null,
  confirmLoading: false
};

const tableRef = ref(null);
const state = reactive<stateProps>(cloneDeep(defaultState));

const handleCancel = () => {
  const { clearSelection } = tableRef.value.getTableRef();
  const { menuData, ...argState } = defaultState;
  resetReactiveState(state, argState);
  clearSelection();
  state.visible = false;
};

const handleConfirm = () => {
  state.confirmLoading = true;

  updateRoleMenu({
    role_id: state.curRoleMes.id,
    menu_id: (state.formData.menuIds as Array<Menu>).map(item => item.id)
  })
    .then(res => {
      if (res.success) {
        successMes(typeof res.data === "string" ? res.data : "");
        handleCancel();
      }
    })
    .finally(() => {
      state.confirmLoading = false;
    });
};

const setChildren = (children: Menu[], type: boolean) => {
  // 编辑多个子层级
  children.map((j: Menu) => {
    toggleSelection(j, type);
    if (j.children) {
      setChildren(j.children, type);
    }
  });
};

// 设置父级选中/取消
const setParent = (
  currentRow: Menu,
  type: boolean,
  parent: Menu[],
  selectionLists: Menu[]
) => {
  if (!parent.length) {
    parent = state.menuData;
  }
  let allSelect: any[] = [];
  parent.forEach((item: Menu) => {
    if (item.children) {
      // 注：Parent 是当前选中节点的所有父节点的一个字符串形式的数据，这个很关键
      if (currentRow.parentId === item.id) {
        // 选中
        if (type) {
          selectionLists.forEach((k: Menu) => {
            item.children?.forEach((j: Menu) => {
              if (k.id == j.id) {
                allSelect.push(j);
              }
            });
          });
          if (allSelect.length == item.children.length) {
            toggleSelection(item, type);
            selectionLists.push(item);
            select(selectionLists, item);
          } else {
            setParent(currentRow, type, item.children, selectionLists);
          }
        } else {
          // 取消选中
          toggleSelection(item, type);
          setParent(currentRow, type, item.children, []);
        }
      }
    }
  });
};

/* 回显菜单 */
const toggleSelection = (row: Menu, select: boolean) => {
  // 编辑多个子层级
  if (row) {
    const { toggleRowSelection } = tableRef.value.getTableRef();
    toggleRowSelection(row, select);
  }
};

// 选中父节点时，子节点一起选中/取消
const select = (selection: Menu[], row: Menu) => {
  const hasSelect = selection.some((el: Menu) => {
    return row.id === el.id;
  });
  if (hasSelect) {
    if (row.children) {
      // 解决子组件没有被勾选到
      setChildren(row.children, true);
    }
    // 子节点被全勾选，父节点也勾上
    setParent(row, true, [], selection);
  } else {
    if (row.children) {
      setChildren(row.children, false);
    }
    // 子级取消选中, 传入当前选中节点, 所有父级取消选中
    // setParent(row, false, [], []);
  }
};

// 选择全部
const selectAll = (selection: Menu[]) => {
  // tabledata第一层只要有在selection里面就是全选
  const isSelect = selection.some((el: Menu) => {
    const tableDataPaths = state.menuData.map((j: Menu) => j.id);
    return tableDataPaths.includes(el.id);
  });
  // tableDate第一层只要有不在selection里面就是全不选
  const isCancel = !state.menuData.every((el: Menu) => {
    const selectPaths = selection.map(j => j.id);
    return selectPaths.includes(el.id);
  });
  if (isCancel) {
    state.menuData.map((el: Menu) => {
      if (el.children) {
        // 解决子组件没有被勾选到
        setChildren(el.children, false);
      }
    });
  }
  if (isSelect) {
    selection.map(el => {
      if (el.children) {
        // 解决子组件没有被勾选到
        setChildren(el.children, true);
      }
    });
  }
};

// 表格选择变化
const handleSelectionChange = (menus: Menu[]) => {
  state.formData.menuIds = menus;
};

const initMenu = async () => {
  const menuRes = await getMenu();
  if (menuRes.success) {
    state.menuData = menuRes.data;
  }
};

// 递归调取待选择的菜单
const getRecursionMenu = (menus: Menu[], menuIds: number[]) => {
  const toBeSelectedMenu: Menu[] = [];

  const getMenus = (menus: Menu[], menuIds: number[]) => {
    menus.forEach(m => {
      if (m.children) {
        getMenus(m.children, menuIds);
      }
      if (menuIds.includes(m.id)) {
        toBeSelectedMenu.push(m);
      }
    });

    return toBeSelectedMenu;
  };

  return getMenus(menus, menuIds);
};

const getBind = async (roleId: number) => {
  if (typeof roleId === "number") {
    const res = await getBindMenu({
      roleId
    });
    if (res.success) {
      const menuIds = res.data.map(item => item.id);
      state.formData.menuIds = menuIds;

      const toBeSelectedMenu: Menu[] = getRecursionMenu(
        state.menuData,
        menuIds
      );

      toBeSelectedMenu.forEach(row => {
        toggleSelection(row, true);
      });
    }
  }
};

const open = (row: Role) => {
  state.visible = true;
  state.formData.name = row.name;
  state.curRoleMes = row;

  getBind(row.id);
};

onMounted(() => {
  initMenu();
});

defineExpose({
  open
});
</script>

<style scoped></style>
