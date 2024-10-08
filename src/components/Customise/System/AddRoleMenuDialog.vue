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
        @selection-change="handleSelectionChange"
      />
    </template>

    <template #dialog-footer="{ handleConfirm, handleCancel }">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
    </template>
  </PlusDialogForm>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";
import { cloneDeep } from "@pureadmin/utils";
import { Role, updateRoleMenu } from "@/api/role";
import { getMenu, Menu } from "@/api/menu";
import { resetReactiveState } from "@/utils/globalUtils";
import { FormRules } from "element-plus";
import { successMes } from "@/utils/globalReqMes";

interface stateProps {
  columns: PlusColumn[];
  menuData: any[];
  visible: boolean;
  formData:
    | {
        name: string;
        menuIds: number[];
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

const open = (row: Role) => {
  state.visible = true;
  state.formData.name = row.name;
  state.curRoleMes = row;
};

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
    menu_id: state.formData.menuIds
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

const handleSelectionChange = (menus: Menu[]) => {
  state.formData.menuIds = menus.map(m => m.id);
};

/* 回显菜单 */
const toggleSelection = (rows?: any) => {
  const { toggleRowSelection, clearSelection } = tableRef.value.getTableRef();
  if (rows) {
    rows.forEach(row => {
      toggleRowSelection(row, undefined);
    });
  } else {
    clearSelection();
  }
};

onMounted(() => {
  getMenu()
    .then(res => {
      if (res.success) {
        state.menuData = res.data;
      }
    })
    .catch(() => {});
});

defineExpose({
  open
});
</script>

<style scoped></style>
