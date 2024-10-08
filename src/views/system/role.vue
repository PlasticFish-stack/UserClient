<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoleTableStore } from "@/store/modules/customise/role";
import { useColumns } from "@/config/system/role";
import DialogForm from "@/components/Customise/System/role.vue";
import AddRoleMenuDialog from "@/components/Customise/System/AddRoleMenuDialog.vue";

defineOptions({
  name: "SystemRole"
});
const {
  columns,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns();
const roleTableStore = useRoleTableStore();

const roleMenuDialogElement = ref(null);

function addRoleForm() {
  const row = {
    role_name: "",
    role_desc: "",
    status: true,
    role_identifier: ""
  };
  roleTableStore.displayTarget();
  roleTableStore.rowDataInsert(row);
  roleTableStore.typeChange("add");
}
onMounted(() => {
  roleTableStore.roleList();

  if (roleMenuDialogElement.value) {
    roleTableStore.$state.roleMenuDialogRef = roleMenuDialogElement.value;
  }
});
</script>

<template>
  <div class="main">
    <el-button class="mb-2" @click="addRoleForm">新建角色</el-button>
    <pure-table
      ref="tableRef"
      style="border-radius: 8px"
      adaptive
      :adaptiveConfig="adaptiveConfig"
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="roleTableStore.loading"
      :loading-config="loadingConfig"
      :data="
        roleTableStore.data.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      :columns="columns"
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    />
    <DialogForm v-if="roleTableStore.display" />
    <AddRoleMenuDialog ref="roleMenuDialogElement" />
  </div>
</template>
<style>
.cell {
  text-align: center;
}
.row {
  height: 55px;
}
.container {
  width: 100%;
  height: 100%;
  background: #000;
}
.none-margin {
  margin: 0 !important;
}
</style>
