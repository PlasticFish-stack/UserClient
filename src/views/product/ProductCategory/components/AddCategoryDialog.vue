<script setup lang="ts">
import { computed, h, reactive, ref } from "vue";
import { PlusColumn, PlusDialogForm } from "plus-pro-components";
import { FormRules } from "element-plus";
import { useProductCategoryStore } from "../modules/store";
import {
  CategoryFormulasTypes,
  handleProductCategoryAdd,
  handleProductCategoryUpdate
} from "@/api/productCategory";
import { useColumns } from "../modules/functionConfig";
import { cloneDeep } from "@pureadmin/utils";
import { useFieldColumns } from "../modules/fieldConfig";
import { Plus, Delete } from "@element-plus/icons-vue";
import { successMes } from "@/utils/globalReqMes";

const { columns: functionColumns } = useColumns();
const { columns: fieldColumns } = useFieldColumns();
const categoryStore = useProductCategoryStore();

const form = ref(null);
const state = reactive({
  visible: false,
  form: null,
  upCategorys: [],
  categoryMapping: {},
  subLoading: false
});

const edit = computed(() => categoryStore.$state.state.edit);

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
      label: "税率",
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
    { required: true, message: "请输入税率" },
    { type: "number", message: "税率必须为数字" }
  ],
  sort: [
    { required: true, message: "请输入排序" },
    { type: "number", message: "税率必须为数字" }
  ]
});

const addKey = list => {
  return list.map(item => ({
    ...item,
    key: Math.floor(Math.random() * 1000)
  }));
};

const open = (curRow: any) => {
  const rows = cloneDeep(curRow);
  // const randomFormulas = getRandomFormulas();

  /* const formulas = randomFormulas.map((item, idx) => {
    const i = rows.formulas[idx];
    return {
      ...item,
      ...i
    };
  }); */

  rows.formulas = addKey(rows.formulas);
  rows.fields = addKey(rows.fields);

  state.form = rows;
  state.upCategorys = [
    {
      id: 0,
      name: "顶层",
      children: categoryStore.$state.state.categoryData
    }
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

const addFormulasRow = () => {
  state.form.formulas.push({
    key: Math.floor(Math.random() * 1000),
    name: "",
    nickname: ""
  });
};

const delFormulasRow = (row: CategoryFormulasTypes) => {
  const idx = state.form.formulas.indexOf(row);
  if (idx !== -1) state.form.formulas.splice(idx, 1);
};

const addFeildsRow = () => {
  state.form.fields.push({
    key: Math.floor(Math.random() * 1000),
    name: "",
    nickname: ""
  });
};

const delFeildsRow = (row: CategoryFormulasTypes) => {
  const idx = state.form.fields.indexOf(row);
  if (idx !== -1) state.form.formulas.splice(idx, 1);
};

const handleCancel = () => {
  categoryStore.editTarget(false);
  categoryStore.curCategoryChange(null);
  state.visible = false;
};

const removeAppointField = (fields: string[], list: any[]) => {
  return list.map(l => {
    return Object.keys(l).reduce((pre, key) => {
      return fields.includes(key)
        ? pre
        : {
            ...pre,
            [key]: l[key]
          };
    }, {});
  });
};

const handleConfirm = async (values: CategoryFormulasTypes) => {
  const { children, ...args } = cloneDeep(values);
  const data = args;
  state.subLoading = true;
  data.formulas = removeAppointField(
    ["key", "previewValue", "preview"],
    data.formulas
  ).filter(f => (f as CategoryFormulasTypes).formula);
  data.fields = removeAppointField(["key"], data.fields);

  if (edit.value) {
    const res = await handleProductCategoryUpdate(data);
    successMes(res.data);
  } else {
    const res = await handleProductCategoryAdd(data);
    successMes(res.data);
  }
  state.subLoading = false;
  handleCancel();
  categoryStore.initCategory();
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
    v-loading="state.subLoading"
    style="border-radius: 8px"
    width="900"
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
      >
        <template #append>
          <el-button
            v-if="state.form.formulas.length < 3"
            plain
            class="add-btn"
            link
            :icon="Plus"
            @click="addFormulasRow"
          >
            添加一行数据
          </el-button>
        </template>
        <template #operation="{ row }">
          <el-button
            class="reset-margin"
            link
            type="primary"
            :icon="Delete"
            @click="delFormulasRow(row)"
          />
        </template>
      </pure-table>
    </template>

    <template #plus-field-fields>
      <pure-table
        border
        row-key="key"
        align-whole="center"
        :data="state.form.fields"
        :columns="fieldColumns"
        maxHeight="240"
      >
        <template #append>
          <el-button
            plain
            class="add-btn"
            link
            :icon="Plus"
            @click="addFeildsRow"
          >
            添加一行数据
          </el-button>
        </template>
        <template #operation="{ row }">
          <el-button
            class="reset-margin"
            link
            type="primary"
            :icon="Delete"
            @click="delFeildsRow(row)"
          />
        </template>
      </pure-table>
    </template>
  </PlusDialogForm>
</template>

<style lang="scss" scoped>
.add-btn {
  width: 100%;
  margin: 4px 0;
}
</style>
