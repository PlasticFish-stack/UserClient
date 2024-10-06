<script setup lang="ts">
import { onMounted } from "vue";
import { useMenuTableStore } from "@/store/modules/customise/menu";
import { useColumns } from "../../config/system/menu";
import DialogForm from "@/components/Customise/System/menu.vue";

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
function addMenuForm() {
  const row = {
    name: "",
    identifier: "",
    path: "/null",
    status: true,
    description: "",
    icon: "",
    component: "",
    sort: 1,
    parentid: 0
  };
  menuTableStore.displayTarget();
  menuTableStore.isParent(true);
  menuTableStore.rowDataInsert(row);
  menuTableStore.typeChange("add");
}
onMounted(() => {
  menuTableStore.menuList();
});
</script>
<template>
  <div class="main">
    <el-button class="mb-2" @click="addMenuForm">新建菜单</el-button>
    <pure-table
      ref="tableRef"
      style="border-radius: 8px"
      default-expand-all
      adaptive
      border
      :adaptiveConfig="adaptiveConfig"
      row-key="id"
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
      headerAlign="left"
      :columns="columns"
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    />
    <DialogForm v-if="menuTableStore.setting.display" />
  </div>
</template>

<style scoped></style>
