<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import useInformationStore from "./modules/store";
import { useColumns } from "./modules/config";

const informationStore = useInformationStore();

const informationFormRef = ref(null);

const {
  columns,
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
      :columns="columns"
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped></style>
