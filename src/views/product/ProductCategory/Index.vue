<script setup lang="ts">
import { computed, defineComponent, onMounted, provide, ref } from "vue";
import { useProductCategoryStore } from "./modules/store";
import { useColumns } from "./modules/config";
import AddCategoryDialog from "./components/AddCategoryDialog.vue";

defineComponent({
  name: "ProductCategory"
});
const categoryStore = useProductCategoryStore();

const {
  columns,
  loadingConfig,
  pagination,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns();

const categoryRef = ref(null);

const loading = computed(() => categoryStore.$state.state.loading);
const data = computed(() => categoryStore.$state.state.categoryData);

provide("categoryRef", categoryRef);

onMounted(() => {
  categoryStore.initCategory();
});
</script>

<template>
  <div class="main">
    <!-- <div>产品类别</div> -->
    <el-button class="mb-2">新建类别</el-button>
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
      :loading="loading"
      :loading-config="loadingConfig"
      :data="
        data.slice(
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
    <AddCategoryDialog ref="" />
  </div>
</template>

<style lang="scss" scoped></style>
