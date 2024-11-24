<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import useBrandStore from "./modules/store";
import { useColumns } from "./modules/config";
import AddBrandDialog from "./components/AddBrandDialog.vue";

const brandStore = useBrandStore();

const brandFormRef = ref(null);

const {
  columns,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns(brandFormRef);

const brandData = computed(() => brandStore.$state.state.brandData);

const addBrandForm = () => {
  brandStore.initCurBrand({
    name: "",
    description: ""
  });
  brandStore.typeChange("Add");
  brandFormRef.value?.open();
};

onMounted(() => {
  brandStore.initBrand();
});
</script>

<template>
  <div class="main">
    <el-button class="mb-2" @click="addBrandForm">新建品牌</el-button>
    <pure-table
      ref="tableRef"
      style="border-radius: 8px"
      adaptive
      :adaptiveConfig="adaptiveConfig"
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="brandStore.$state.state.loading"
      :loading-config="loadingConfig"
      :data="
        brandData.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
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
    <AddBrandDialog ref="brandFormRef" />
  </div>
</template>

<style lang="scss" scoped></style>
