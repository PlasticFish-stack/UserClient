<script setup lang="ts">
import { computed, h, reactive, ref, watch, watchEffect } from "vue";
import { PlusColumn, PlusDialogForm } from "plus-pro-components";
import { FormRules } from "element-plus";
import { useProductCategoryStore } from "../modules/store";
import { CategoryTypes } from "@/api/productCategory";
import { useColumns } from "../modules/functionConfig";

const { columns: functionColumns, dataList, onAdd, onDel } = useColumns();
const categoryStore = useProductCategoryStore();

const form = ref(null);
const state = reactive({
  visible: false,
  form: null,
  upCategorys: [],
  categoryMapping: {}
});

const edit = computed(() => categoryStore.$state.state.edit);
const curCategory = computed(() => categoryStore.$state.state.curCategory);

watchEffect(() => {
  console.log("==========", {
    /* curCategory,
    state,
    edit */
    form: state.form
  });
});

const columns = computed<PlusColumn[]>(() => {
  return [
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
      valueType: "input-number",
      fieldProps: {
        min: 0
      }
    },
    {
      label: "上层类别",
      prop: "parentId",
      valueType: "tree-select",
      fieldProps: {
        data: state.upCategorys,
        showCheckbox: true,
        defaultExpandAll: true,
        clearable: false,
        multiple: false,
        checkStrictly: true,
        valueKey: "id",
        style: {
          width: "100%"
        }
      },
      fieldSlots: {
        default: ({ data }) => {
          return h("div", null, data.name);
        },
        label: row => {
          return h("div", null, state.categoryMapping[row.value]);
        }
      }
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
  ];
});

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      trigger: "blur",
      message: "请输入类别名称"
    }
  ],
  tax: [
    { required: true, message: "请输入汇率" },
    { type: "number", message: "汇率必须为数字" }
  ],
  sort: [
    { required: true, message: "请输入排序" },
    { type: "number", message: "汇率必须为数字" }
  ]
});

const handleCancel = () => {
  categoryStore.editTarget(false);
  categoryStore.curCategoryChange(null);
  state.visible = false;
};

const handleConfirm = (values: CategoryTypes) => {
  console.log("values=============", values);
  handleCancel();
};

const open = (curRow: any) => {
  state.form = curRow;
  state.upCategorys = [
    {
      id: 0,
      name: "顶层"
    },
    ...categoryStore.$state.state.categoryData
  ];

  const recursionCategory = list => {
    return list.reduce((pre, cur) => {
      pre = {
        ...pre,
        [cur.id]: cur.name
      };
      if (cur.children) {
        return {
          ...pre,
          ...recursionCategory(cur.children)
        };
      }
      return pre;
    }, {});
  };
  state.categoryMapping = recursionCategory(state.upCategorys);

  state.visible = true;
};

defineExpose({
  open
});
</script>

<template>
  <PlusDialogForm
    ref="form"
    v-model:visible="state.visible"
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
      <pure-table
        row-key="id"
        align-whole="center"
        :data="dataList"
        :columns="functionColumns"
      />
    </template>
  </PlusDialogForm>
</template>

<style lang="scss" scoped></style>
