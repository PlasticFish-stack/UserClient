<script setup lang="ts">
import { computed, h, reactive, ref, watch, watchEffect } from "vue";
import { PlusColumn, PlusDialogForm } from "plus-pro-components";
import { FormRules } from "element-plus";
import { useProductCategoryStore } from "../modules/store";
import { CategoryTypes } from "@/api/productCategory";
import { useColumns } from "../modules/functionConfig";
import { cloneDeep } from "@pureadmin/utils";
import { useFieldColumns } from "../modules/fieldConfig";
import { Plus, Delete } from "@element-plus/icons-vue";

const { columns: functionColumns, getRandomFormulas } = useColumns();
const { columns: fieldColumns, dataList, onAdd, onDel } = useFieldColumns();
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
    },
    {
      label: "字段",
      prop: "fields"
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
  const rows = cloneDeep(curRow);
  const randomFormulas = getRandomFormulas();

  /* 
     请求回来的formulas只有一个
     拿formulas循环只有一次循环，所以我还需要再填充两行空数据（这个操作要加校验，代码有点恶心）

     锁死三个（randomFormulas），用randomFormulas去循环，不足直接填充，这样很方便
  */

  const formulas = randomFormulas.map((item, idx) => {
    const i = rows.formulas[idx];
    return {
      ...item,
      ...i
    };
  });

  rows.formulas = formulas;

  state.form = rows;
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
        row-key="key"
        align-whole="center"
        border
        :data="state.form.formulas"
        :columns="functionColumns"
      />
    </template>

    <template #plus-field-fields>
      <pure-table
        border
        row-key="id"
        align-whole="center"
        :data="[]"
        :columns="fieldColumns"
      >
        <template #empty>
          <el-empty description="暂无数据" :image-size="50" />
        </template>
        <template #append>
          <el-button plain class="add-btn" :icon="Plus" @click="onAdd">
            添加一行数据
          </el-button>
        </template>
        <template #operation="{ row }">
          <el-button
            class="reset-margin"
            link
            type="primary"
            :icon="Delete"
            @click="onDel(row)"
          />
        </template>
      </pure-table>
    </template>
  </PlusDialogForm>
</template>

<style lang="scss" scoped>
.add-btn {
  width: 90%;
  margin: 4px 0;
  margin-left: 5%;
}
</style>
