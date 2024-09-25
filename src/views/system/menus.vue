<script setup lang="ts">
import { onMounted } from "vue";
import { useMenuTableStore } from "@/store/modules/customise/menu";
import { useColumns } from "../../config/role/table";
import DialogForm from "@/components/Customise/Role/form.vue";

defineOptions({
  name: "SystemMenu"
});
const {
  columns,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns();
const menuTableStore = useMenuTableStore();
function addRoleForm() {
  const row = {
    role_name: "",
    role_desc: "",
    status: true,
    role_identifier: ""
  };
  menuTableStore.displayTarget();
  menuTableStore.rowDataInsert(row);
  menuTableStore.typeChange("add");
}
onMounted(() => {
  menuTableStore.roleList();
});
</script>
<template>
  <div class="main">
    <el-button class="mb-2" @click="addRoleForm">新建菜单</el-button>
    <pure-table
      ref="tableRef"
      style="border-radius: 8px"
      adaptive
      :adaptiveConfig="adaptiveConfig"
      row-key="role_id"
      alignWhole="center"
      showOverflowTooltip
      :loading="menuTableStore.loading"
      :loading-config="loadingConfig"
      :data="
        menuTableStore.data.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      :columns="columns"
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    />
    <DialogForm v-if="menuTableStore.display" />
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
