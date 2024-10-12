<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useUserTableStore } from "./CoreModules/store";
import { useColumns } from "./CoreModules/config";
defineOptions({
  name: "SystemUser"
});

const {
  columns,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns();
const userTableStore = useUserTableStore();

const userData = computed(() => userTableStore.$state.state.userData);

onMounted(() => {
  userTableStore.getUserPage();
});
</script>

<template>
  <div class="main">
    <el-button class="mb-2" @click="userTableStore.addUserForm()"
      >新建用户</el-button
    >
    <pure-table
      ref="tableRef"
      style="border-radius: 8px"
      adaptive
      :adaptiveConfig="adaptiveConfig"
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="userTableStore.$state.state.loading"
      :loading-config="loadingConfig"
      :data="
        userData.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      :columns="columns"
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    />
  </div>
</template>
<style lang="scss" scoped>
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

:deep(.cell) {
  text-align: center;

  .avatar-warpper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .user-avatar {
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }
  }
}
</style>
