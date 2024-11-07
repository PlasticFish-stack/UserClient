<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { PlusColumn, PlusDialogForm } from "plus-pro-components";
import { FormRules } from "element-plus";
import { successMes } from "@/utils/globalReqMes";
import useBrandStore from "../modules/store";
import { cloneDeep } from "@pureadmin/utils";
import { resetReactiveState } from "@/utils/globalUtils";
import { handleBrandAdd, handleBrandUpdate } from "@/api/brand";

const brandStore = useBrandStore();

const defaultState = {
  visible: false,
  form: null
};

const state = reactive(cloneDeep(defaultState));

const type = computed(() => brandStore.$state.state.type);
const title = computed(() => {
  const type = brandStore.$state.state.type;
  return type === "Add" ? "新增品牌信息" : "编辑品牌信息";
});

const columns = ref<PlusColumn[]>([
  {
    label: "货号",
    prop: "itemNumber",
    valueType: "copy"
  },
  {
    label: "类别",
    prop: "description",
    valueType: "input"
  }
]);

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      trigger: "blur",
      message: "请输入品牌名称"
    }
  ],
  description: [
    {
      required: true,
      trigger: "blur",
      message: "请输入类别"
    }
  ]
});

const open = () => {
  state.visible = true;

  /* const row = brandStore.$state.state.curBrand;
  state.form = row; */
};

const handleCancel = () => {
  /* resetReactiveState(state, defaultState);
  brandStore.initCurBrand(null);
  state.visible = false; */
};

const handleConfirm = async value => {
  if (type.value === "Add") {
    const res = await handleBrandAdd([value]);
    successMes(res.data);
  } else {
    const res = await handleBrandUpdate(value);
    successMes(res.data);
  }
  // brandStore.initBrand();
  handleCancel();
};

defineExpose({
  open
});
</script>

<template>
  <PlusDialogForm
    v-model:visible="state.visible"
    v-model="state.form"
    :title="title"
    style="border-radius: 8px"
    :form="{
      columns,
      rules,
      labelWidth: '100px',
      labelPosition: 'right'
    }"
    :dialog="{
      cancelText: '取消',
      confirmText: '确定'
    }"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #dialog-header> {{ title }} </template>
  </PlusDialogForm>
</template>

<style lang="scss" scoped></style>
