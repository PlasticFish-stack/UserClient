<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useUserTableStore } from "../CoreModules/store";
import {
  type FieldValues,
  type PlusColumn,
  PlusDialogForm
} from "plus-pro-components";
import { User } from "../CoreModules/types";
import { getRole, Role } from "@/api/role";
import { cloneDeep } from "@pureadmin/utils";
import { resetReactiveState } from "@/utils/globalUtils";
import { getBindRole, updateUserRole } from "@/api/user";
import { successMes } from "@/utils/globalReqMes";

interface stateProps {
  columns: PlusColumn[];
  roleDate: any[];
  visible: boolean;
  form:
    | {
        name: string;
        roleId: Role[];
      }
    | FieldValues;
  curUserMes: User;
  confirmLoading: boolean;
}

const columns: PlusColumn[] = [
  {
    label: "用户名称",
    prop: "name",
    valueType: "input",
    fieldProps: {
      disabled: true
    }
  },
  {
    label: "角色绑定",
    prop: "roleId",
    valueType: "input"
  }
];

const tableColumns: TableColumnList = [
  {
    type: "selection",
    align: "center"
  },
  {
    label: "角色名称",
    prop: "name"
  },
  {
    label: "角色简介",
    prop: "description"
  },
  {
    label: "角色标识",
    prop: "identifier"
  }
];

const userTableStore = useUserTableStore();

const defaultState: stateProps = {
  columns: cloneDeep(columns),
  roleDate: [],
  visible: false,
  form: {
    name: "",
    roleId: []
  },
  curUserMes: null,
  confirmLoading: false
};
const tableRef = ref(null);

const state = reactive<stateProps>(cloneDeep(defaultState));

// 表格选择变化
const handleSelectionChange = (roleIds: Role[]) => {
  state.form.roleId = roleIds;
};

const initRole = async () => {
  const res = await getRole();
  if (res.success) {
    state.roleDate = res.data;
  }
};

/* 回显菜单 */
const toggleSelection = (row: User, select: boolean) => {
  // 编辑多个子层级
  if (row) {
    const { toggleRowSelection } = tableRef.value.getTableRef();
    toggleRowSelection(row, select);
  }
};

const getBind = async (userId: number) => {
  if (typeof userId === "number") {
    const res = await getBindRole({
      userId
    });
    if (res.success) {
      const roleId = res.data;
      state.form.roleId = roleId;

      const ids = roleId.map(item => item.id);
      const toBeSelectedMenu = state.roleDate.filter(item =>
        ids.includes(item.id)
      );

      toBeSelectedMenu.forEach(row => {
        toggleSelection(row, true);
      });
    }
  }
};

const open = (row: User) => {
  state.visible = true;
  state.form.name = row.name;
  state.curUserMes = row;
  getBind(row.id);
};

const handleCancel = () => {
  const { clearSelection } = tableRef.value.getTableRef();
  const { roleDate, ...argState } = defaultState;
  clearSelection();
  resetReactiveState(state, argState);
};
const handleConfirm = (values: any) => {
  state.confirmLoading = true;
  updateUserRole({
    userId: state.curUserMes.id,
    roleId: (state.form.roleId as Array<Role>).map(item => item.id)
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

onMounted(() => {
  initRole();
});

defineExpose({
  open
});
</script>

<template>
  <PlusDialogForm
    v-model:visible="state.visible"
    v-model="state.form"
    title="角色菜单绑定"
    style="border-radius: 8px"
    :form="{ columns }"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #plus-field-roleId>
      <pure-table
        ref="tableRef"
        row-key="id"
        :data="state.roleDate"
        :columns="tableColumns"
        :border="true"
        :select-on-indeterminate="true"
        @selection-change="handleSelectionChange"
      />
    </template>
    <template #dialog-footer="{ handleConfirm, handleCancel }">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        v-loading="state.confirmLoading"
        type="primary"
        @click="handleConfirm"
      >
        确定
      </el-button>
    </template>
  </PlusDialogForm>
</template>

<style lang="scss" scoped></style>
