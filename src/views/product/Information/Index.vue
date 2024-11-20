<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import useInformationStore from "./modules/store";
import { useColumns } from "./modules/config";
import DetailDrawer from "./components/DetailDrawer.vue";
import InformationDrawer from "./components/InformationDrawer.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Plane from "@iconify-icons/ri/plane-line";
import Refresh from "@iconify-icons/ep/refresh";

const informationStore = useInformationStore();

const informationRef = ref(null);
const detailDrawerRef = ref(null);

const {
  columns,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns(informationRef, detailDrawerRef);

const form = ref({
  username: ""
});

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

const resetForm = () => {
  form.value = null;
};

watch(form, params => {
  console.log("===========", params);
});

onMounted(() => {
  informationStore.init();
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto mb-2"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm">
          重置
        </el-button>
        <el-button type="primary" @click="addInformationForm">
          新增产品信息
        </el-button>
      </el-form-item>
    </el-form>

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
    <InformationDrawer ref="informationRef" />
    <DetailDrawer ref="detailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
