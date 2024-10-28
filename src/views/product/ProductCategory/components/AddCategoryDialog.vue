<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from "vue";
import { useColumns } from "../modules/config";
import { FieldValues, PlusColumn, PlusDialogForm } from "plus-pro-components";
import { FormRules } from "element-plus";
import { useProductCategoryStore } from "../modules/store";

const { displayTarget } = useColumns();
const categoryStore = useProductCategoryStore();

const form = ref(null);
const state = reactive({
  form: null,
  upCategorys: []
});

const edit = computed(() => categoryStore.$state.state.edit);
const visible = computed(() => categoryStore.$state.state.display);
const curCategory = computed(() => categoryStore.$state.state.curCategory);

watchEffect(() => {
  console.log("==========", {
    curCategory,
    visible
  });
});

const columns = reactive<PlusColumn[]>([
  {
    label: "类别名称",
    prop: "name",
    valueType: "copy"
  },
  {
    label: "类别简介",
    prop: "description",
    valueType: "input"
  },
  {
    label: "汇率",
    prop: "tax",
    valueType: "input-number"
  },
  {
    label: "上层类别",
    prop: "parentId",
    valueType: "select"
  },
  {
    label: "排序",
    prop: "sort",
    valueType: "input-number",
    fieldProps: {
      min: 0
    }
  },
  {
    label: "函数组",
    prop: "formulas"
  }
]);

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      trigger: "blur",
      message: "请输入类别名称"
    }
  ],
  tax: [
    {
      required: true,
      trigger: "blur",
      message: "请输入汇率"
    },
    {
      required: true,
      trigger: "blur",
      min: 0
    }
  ]
});

const handleCancel = () => {
  displayTarget();
};

const handleConfirm = () => {
  handleCancel();
};
</script>

<template>
  <PlusDialogForm
    ref="form"
    v-model:visible="visible"
    v-model="state.form"
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
    <template #dialog-header> {{ edit ? "编辑类别" : "新建类别" }} </template>
    <template #plus-field-formulas>
      <div>函数组</div>
    </template>
  </PlusDialogForm>
</template>

<style lang="scss" scoped></style>
