<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { PlusColumn, PlusDescriptions } from "plus-pro-components";
import { FormRules } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import { resetReactiveState } from "@/utils/globalUtils";
import useInformationStore from "../modules/store";
import { useCostsColumns } from "../modules/costsConfig";
import { useOptionsColumns } from "../modules/optionsConfig";
import { getCategory } from "@/api/productCategory";
import { getBrand } from "@/api/brand";

const informationStore = useInformationStore();
const { expandColumns } = useCostsColumns();
const { optionsColumns } = useOptionsColumns();

const defaultState = {
  visible: false,
  form: null,
  title: "查看产品信息"
};

const categoryMapping = computed(
  () => informationStore.$state.state.categoryMapping
);
const brandMapping = computed(() => informationStore.$state.state.brandMapping);

const state = reactive(cloneDeep(defaultState));

const columns = reactive<PlusColumn[]>([
  {
    label: "货号",
    prop: "itemNumber"
  },
  {
    label: "产品类别",
    prop: "typeLabel"
  },
  {
    label: "品牌",
    prop: "brandLabel"
  },
  {
    label: "sku",
    prop: "sku"
  },
  {
    label: "spu",
    prop: "spu"
  },
  {
    label: "数量",
    prop: "quantity"
  },
  {
    label: "规格",
    prop: "specifications",
    valueType: "input"
  },
  {
    label: "条形码",
    prop: "barcode"
  },
  {
    label: "海关编码",
    prop: "customscode"
  },
  {
    label: "描述",
    prop: "description"
  },
  {
    label: "颜色",
    prop: "color"
  },
  {
    label: "产品字段",
    prop: "options"
  },
  {
    label: "成本价表",
    prop: "costs"
  }
]);

const handleIntegrationOptions = options => {
  return Object.keys(options).map(key => {
    return {
      name: key,
      value: options[key]
    };
  });
};

const open = () => {
  state.visible = true;

  const row = cloneDeep(informationStore.$state.state.curInformation);
  const fields = row.options || {};
  row.options = handleIntegrationOptions(fields);

  row.brandLabel = brandMapping.value?.[row.brandId]?.name;
  row.typeLabel = categoryMapping.value?.[row.typeId]?.name;

  state.form = row;
};

const handleCancel = () => {
  resetReactiveState(state, defaultState);
  state.visible = false;
};

defineExpose({
  open
});
</script>

<template>
  <el-drawer
    v-model="state.visible"
    :close-on-click-modal="false"
    size="770px"
    :title="state.title"
  >
    <template #default>
      <PlusDescriptions :column="1" :columns="columns" :data="state.form">
        <template #plus-desc-options="{ value }">
          <div style="width: 600px">
            <pure-table stripe :data="value" :columns="optionsColumns" />
          </div>
        </template>

        <template #plus-desc-costs="{ value }">
          <div style="width: 600px">
            <pure-table stripe :data="value" :columns="expandColumns" />
          </div>
        </template>
      </PlusDescriptions>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleCancel">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss"></style>
