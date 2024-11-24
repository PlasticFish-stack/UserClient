<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ExportDialog from "./components/ExportDialog.vue";
import useSourceStore from "./modules/store";
import { useColumns } from "./modules/config";

const sourceStore = useSourceStore();

const {
  columns,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns();

const exportRef = ref(null);

const data = computed(() => sourceStore.$state.state.data);
const loading = computed(() => sourceStore.$state.state.loading);

const handleOpen = () => {
  exportRef.value.open();
};

onMounted(async () => {
  const { currentPage: pageNum, pageSize } = pagination;
  sourceStore.initSoure({
    pageNum,
    pageSize
  });
  /* const res = await getExport({
    currencyName: "CNY",
    productTypeId: 3,
    productBrandId: 3
  }); */
});
</script>

<template>
  <div class="main">
    <el-button class="mb-2" @click="handleOpen">导出模板</el-button>

    <pure-table
      ref="tableRef"
      style="border-radius: 8px"
      adaptive
      :adaptiveConfig="adaptiveConfig"
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="loading"
      :loading-config="loadingConfig"
      :data="data"
      :columns="
        columns.map(item => ({
          ...item,
          align: 'left'
        }))
      "
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    />
    <ExportDialog ref="exportRef" />
  </div>
</template>

<style lang="scss" scoped></style>
