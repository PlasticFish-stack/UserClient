<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import useInformationStore from "./modules/store";
import { useColumns } from "./modules/config";
import DetailDrawer from "./components/DetailDrawer.vue";
import InformationDrawer from "./components/InformationDrawer.vue";
import { PlusForm, type PlusColumn } from "plus-pro-components";

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

const informationData = computed(
  () => informationStore.$state.state.informationData
);
const categoryData = computed(() => informationStore.$state.state.categoryData);
const brandData = computed(() => informationStore.$state.state.brandData);
const loading = computed(() => informationStore.$state.state.loading);
const form = computed(() => informationStore.$state.form);

const formColumns: PlusColumn[] = [
  {
    label: "货号",
    prop: "itemNumber",
    valueType: "input"
  },
  {
    label: "类别",
    prop: "typeId",
    valueType: "tree-select",
    fieldProps: {
      data: computed(() => categoryData.value),
      showCheckbox: true,
      defaultExpandAll: true,
      clearable: false,
      multiple: false,
      checkStrictly: true,
      style: {
        width: "100%"
      }
    }
  },
  {
    label: "品牌",
    prop: "brandId",
    valueType: "select",
    fieldProps: {
      clearable: true
    },
    options: computed(() => brandData.value)
  },

  {
    label: "sku",
    prop: "sku",
    valueType: "input"
  },
  {
    label: "spu",
    prop: "spu",
    valueType: "input"
  },
  {
    label: "规格",
    prop: "specifications",
    valueType: "input"
  },
  {
    label: "条形码",
    prop: "barcode",
    valueType: "input"
  },
  {
    label: "海关编码",
    prop: "customscode",
    valueType: "input"
  },
  {
    label: "颜色",
    prop: "color",
    valueType: "input"
  },
  {
    label: "创建日期",
    prop: "createTimeRange",
    valueType: "date-picker",
    fieldProps: {
      type: "daterange",
      startPlaceholder: "起始时间",
      endPlaceholder: "结束时间"
    }
  },
  {
    label: "更新日期",
    prop: "updateTimeRange",
    valueType: "date-picker",
    fieldProps: {
      type: "daterange",
      startPlaceholder: "起始时间",
      endPlaceholder: "结束时间"
    }
  }
];

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

const handleReset = () => {
  informationStore.handelReset();
};

const handleSubmit = values => {
  informationStore.handleFormChange(values);

  informationStore.initInformation({
    pageNum: pagination.currentPage,
    pageSize: pagination.pageSize
  });
};

onMounted(() => {
  informationStore.init({
    pageNum: pagination.currentPage,
    pageSize: pagination.pageSize
  });
});
</script>

<template>
  <div class="main">
    <div
      class="search-form bg-bg_color w-[99/100] pl-4 pr-4 pt-[12px] overflow-auto mb-2"
    >
      <PlusForm
        v-model="form"
        :columns="formColumns"
        :row-props="{
          gutter: 16
        }"
        :col-props="{
          span: 6
        }"
        @submit="handleSubmit"
        @reset="handleReset"
      >
        <template #footer="{ handleSubmit, handleReset }">
          <div class="flex-1 flex justify-between pb-4">
            <el-button type="primary" @click="addInformationForm">
              新增产品信息
            </el-button>
            <div class="flex">
              <el-button type="default" @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleSubmit">搜索</el-button>
            </div>
          </div>
        </template></PlusForm
      >
    </div>

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
      :data="informationData"
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
    <InformationDrawer ref="informationRef" />
    <DetailDrawer ref="detailDrawerRef" />
  </div>
</template>

<style lang="scss" scoped></style>
