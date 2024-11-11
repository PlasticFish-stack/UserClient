<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import useInformationStore from "./modules/store";
import { useColumns } from "./modules/config";
import DetailDrawer from "./components/DetailDrawer.vue";

const informationStore = useInformationStore();

const informationFormRef = ref(null);
const detailDrawerRef = ref(null);

const {
  columns,
  expandColumns,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns(informationFormRef, detailDrawerRef);

const informationData = computed(
  () => informationStore.$state.state.informationData
);
const loading = computed(() => informationStore.$state.state.loading);

const addInformationForm = () => {
  informationStore.typeChange("Add");
  informationStore.initCurInformation({
    itemNumber: "",
    brandId: undefined,
    sku: "",
    spu: "",
    quantity: undefined,
    specifications: "",
    barcode: "",
    customscode: "",
    description: "",
    color: "",
    typeId: null,
    options: {}
  });

  detailDrawerRef.value.open();
};

onMounted(() => {
  informationStore.initInformation();
});
</script>

<template>
  <div class="main">
    <el-button class="mb-2" @click="addInformationForm">新增产品信息</el-button>
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
    >
      <!--   <template #expand="{ row }">
        <div>
          <pure-table stripe :data="row.costs" :columns="expandColumns" />
        </div>
      </template> -->
    </pure-table>
    <DetailDrawer ref="detailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
