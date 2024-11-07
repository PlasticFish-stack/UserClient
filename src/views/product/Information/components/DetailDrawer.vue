<script setup lang="ts">
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import useInformationStore from "../modules/store";
import type { InformationTypes } from "@/api/information";
import { PlusColumn, PlusDrawerForm } from "plus-pro-components";
import { useOptionsColumns } from "../modules/optionsConfig";
import { FormRules } from "element-plus";

const informationStore = useInformationStore();
const { columns: optionsColumns } = useOptionsColumns();

const state = reactive({
  visable: false,
  optionsData: [],
  loading: false,
  categoryData: [],
  brandData: []
});

const form = ref<InformationTypes>(null);

const title = computed(
  () =>
    (informationStore.$state.state.type === "Add" ? "新增" : "编辑") +
    "品牌信息"
);

const rules = reactive<FormRules>({
  itemNumber: [
    {
      required: true,
      trigger: "blur",
      message: "请输入货号"
    }
  ],
  /* typeId: [
    {
      required: true,
      trigger: "blur",
      message: "请选择产品类别"
    }
  ], */
  brandId: [
    {
      required: true,
      trigger: "blur",
      message: "请选择品牌"
    }
  ],
  quantity: [{ type: "number", message: "税率必须为数字" }]
});

const columns = reactive<PlusColumn[]>([
  {
    label: "货号",
    prop: "itemNumber",
    valueType: "input"
  },
  {
    label: "产品类别",
    prop: "typeId",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "品牌",
    prop: "brandId",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "sku",
    prop: "sku",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "spu",
    prop: "spu",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "数量",
    prop: "quantity",
    valueType: "input-number",
    colProps: {
      span: 12
    }
  },
  {
    label: "规格",
    prop: "specifications",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "条形码",
    prop: "barcode",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "海关编码",
    prop: "customscode",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "描述",
    prop: "description",
    valueType: "input"
  },
  {
    label: "颜色",
    prop: "color",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "产品字段",
    prop: "options"
  }
]);

const initOptions = options => {
  const list = Object.keys(options).map(key => {
    return {
      name: key,
      value: options[key]
    };
  });
  state.optionsData = list;
};

const open = () => {
  state.visable = true;
  const curInformation = informationStore.$state.state.curInformation;

  form.value = curInformation;

  const type = informationStore.$state.state.type === "Add";
  if (!type) {
    initOptions(curInformation.options);
  }
};

const handleCancel = () => {
  state.visable = false;
};

watchEffect(() => {
  // console.log("===========", state.visable);
});

const handleConfirm = values => {
  console.log("=============", values);
};

onMounted(() => {});

defineExpose({
  open
});
</script>

<template>
  <PlusDrawerForm
    v-model:visible="state.visable"
    v-model="form"
    size="800px"
    :title="title"
    :form="{
      columns,
      rules,
      rowProps: { gutter: 20 }
    }"
    cancel-text="取消"
    confirm-text="确定"
    :confirm-loading="state.loading"
    :closeOnClickModal="true"
    :closeOnPressEscape="true"
    :modal="false"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #plus-field-options>
      <pure-table
        border
        stripe
        :data="state.optionsData"
        :columns="optionsColumns"
      />
    </template>
  </PlusDrawerForm>
</template>

<style lang="scss" scoped></style>
