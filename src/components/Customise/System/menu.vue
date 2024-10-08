<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import "plus-pro-components/es/components/dialog-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm,
  Mutable
} from "plus-pro-components";
import { useMenuTableStore } from "@/store/modules/customise/menu";
import { ColProps, FormRules, RowProps } from "element-plus";
const menuTableStore = useMenuTableStore();
const visible = ref(false);
const form = ref<FieldValues>(null);
const columns: PlusColumn[] = [
  {
    label: "菜单名称",
    width: 120,
    prop: "name",
    valueType: "copy"
  },
  {
    label: "菜单标识",
    width: 120,
    prop: "identifier",
    valueType: "copy"
  },
  {
    label: "菜单简介",
    width: 120,
    prop: "description",
    valueType: "copy"
  },
  {
    label: "菜单路径",
    width: 120,
    prop: "path",
    valueType: "copy",
    hideInForm: menuTableStore.setting.isParent
  },
  {
    label: "菜单图标",
    width: 120,
    prop: "icon",
    valueType: "copy"
  },
  {
    label: "菜单模板",
    width: 120,
    prop: "component",
    valueType: "copy"
  },
  {
    label: "菜单排序",
    width: 120,
    prop: "sort",
    valueType: "copy",
    hideInForm: !menuTableStore.setting.isParent
  },
  {
    label: "父菜单id",
    width: 120,
    prop: "parentId",
    valueType: "copy",
    hideInForm: menuTableStore.setting.isParent
  },
  {
    label: "是否生效",
    width: 100,
    prop: "status",
    valueType: "switch"
  }
];

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      trigger: "blur",
      message: "请输入菜单名称"
    }
  ],
  identifier: [
    {
      required: true,
      trigger: "blur",
      message: "请输入菜单标识"
    }
  ],
  icon: [
    {
      required: true,
      trigger: "blur",
      message: "请选择菜单图标"
    }
  ],
  component: [
    {
      required: true,
      trigger: "blur",
      message: "请输入菜单模板"
    }
  ],
  sort: [
    {
      required: true,
      trigger: "blur",
      message: "请输入菜单排序"
    }
  ]
});

const handleConfirm = (values: any) => {
  if (menuTableStore.setting.type == "add") {
    menuTableStore.AddMenu(values);
  } else if (menuTableStore.setting.type == "edit") {
    menuTableStore.UpdateMenu(values);
  } else {
    return;
  }
  visible.value = false;
};
const rowProps: Partial<Mutable<RowProps>> = {
  gutter: 20
};
const colProps: Partial<Mutable<ColProps>> = {
  span: 12
};
onMounted(() => {
  visible.value = menuTableStore.setting.display;
  form.value = {
    id: menuTableStore.rowData.id,
    name: menuTableStore.rowData.name,
    description: menuTableStore.rowData.description,
    status: menuTableStore.rowData.status,
    identifier: menuTableStore.rowData.identifier,
    path: menuTableStore.rowData.path,
    icon: menuTableStore.rowData.icon,
    component: menuTableStore.rowData.component,
    sort: menuTableStore.rowData.sort,
    parentId: menuTableStore.rowData.parentId
  };
  console.log(menuTableStore.rowData, "rows");
  watch(
    () => visible.value,
    newVal => {
      menuTableStore.displayTarget(newVal);
    }
  );
});
</script>
<template>
  <PlusDialogForm
    v-model:visible="visible"
    v-model="form"
    style="border-radius: 8px"
    :form="{ columns, rules, labelWidth: '100px', labelPosition: 'right' }"
    @confirm="handleConfirm"
  >
    <template #dialog-header>
      {{
        menuTableStore.setting.type == "add"
          ? menuTableStore.setting.isParent
            ? "新增父菜单"
            : "新增子菜单"
          : "更改菜单"
      }}
    </template>
    <template #dialog-footer="{ handleConfirm, handleCancel }">
      <el-button
        type="primary"
        :loading="menuTableStore.optionLoading"
        @click="handleConfirm"
      >
        <template #loading>
          <div class="custom-loading">
            <svg class="circular" viewBox="-10, -10, 50, 50">
              <path
                class="path"
                d="
            M 30 15
            L 28 17
            M 25.61 25.61
            A 15 15, 0, 0, 1, 15 30
            A 15 15, 0, 1, 1, 27.99 7.5
            L 15 15
          "
                style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
              />
            </svg>
          </div>
        </template>
        确定
      </el-button>
      <el-button type="warning" @click="handleCancel">取消</el-button>
    </template>
  </PlusDialogForm>
</template>
