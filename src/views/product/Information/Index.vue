<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import useInformationStore from "./modules/store";
import { useColumns } from "./modules/config";

const informationStore = useInformationStore();

const informationFormRef = ref(null);

const {
  columns,
  expandColumns,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns(informationFormRef);

const informationData = computed(
  () => informationStore.$state.state.informationData
);
const loading = computed(() => informationStore.$state.state.loading);

const addInformationForm = () => {
  console.log("============add");
};

const handleRowStyles = (data: { row: any; rowIndex: number }) => {
  console.log("========", data);
  /*  if (data.rowIndex % 2) {
    return {
        background:'#ccc'
      }
  } */
  return {
    background: "#ccc"
  };
};

onMounted(() => {
  informationStore.initInformation();
});
</script>

<template>
  <div class="main">
    <el-button class="mb-2" @click="addInformationForm">新建产品</el-button>
    <pure-table
      ref="tableRef"
      style="border-radius: 8px"
      adaptive
      stripe
      :adaptiveConfig="adaptiveConfig"
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="loading"
      :loading-config="loadingConfig"
      :data="
        informationData.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      :row-style="handleRowStyles"
      :columns="columns"
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    >
      <template #expand="{ row }">
        <div>
          <pure-table
            border
            stripe
            :data="row.costs"
            :columns="expandColumns"
          />
        </div>
      </template>
    </pure-table>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__expanded-cell) {
  padding: 0;
}
</style>
