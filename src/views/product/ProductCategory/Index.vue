<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useProductCategoryStore } from "./modules/store";
import { useColumns } from "./modules/config";
import AddCategoryDialog from "./components/AddCategoryDialog.vue";

defineComponent({
  name: "ProductCategory"
});
const categoryStore = useProductCategoryStore();

const categoryRef = ref(null);
const {
  columns,
  loadingConfig,
  pagination,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns(categoryRef);

const loading = computed(() => categoryStore.$state.state.loading);
const data = computed(() => categoryStore.$state.state.categoryData);

const handleAddCategory = () => {
  categoryRef.value.open({
    parentId: 0,
    fields: [],
    formulas: []
  });
};

onMounted(() => {
  categoryStore.initCategory();
});
</script>

<template>
  <div class="main">
    <el-button class="mb-2" @click="handleAddCategory">新建类别</el-button>
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
    <AddCategoryDialog ref="categoryRef" />
  </div>
</template>

<style lang="scss" scoped></style>
