<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import "plus-pro-components/es/components/dialog-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm,
  Mutable
} from "plus-pro-components";
import { useMenuTableStore } from "@/store/modules/customise/menu";
import { ColProps, RowProps } from "element-plus";
const menuTableStore = useMenuTableStore();
const visible = ref(false);
const form = ref<FieldValues>(null);
const columns: PlusColumn[] = [
  {
    label: "菜单名称",
    width: 120,
    prop: "menu_name",
    valueType: "copy"
  },
  {
    label: "菜单标识",
    width: 120,
    prop: "menu_identifier",
    valueType: "copy"
  },
  {
    label: "菜单简介",
    width: 120,
    prop: "menu_desc",
    valueType: "copy"
  },
  {
    label: "菜单路径",
    width: 120,
    prop: "menu_path",
    valueType: "copy"
  },
  {
    label: "菜单图标",
    width: 120,
    prop: "menu_icon",
    valueType: "copy"
  },
  {
    label: "菜单模板",
    width: 120,
    prop: "menu_component",
    valueType: "copy"
  },
  {
    label: "菜单排序",
    width: 120,
    prop: "menu_sort",
    valueType: "copy"
  },
  {
    label: "子菜单?",
    width: 200,
    prop: "menu_type",
    valueType: "switch"
  },
  {
    label: "父菜单id",
    width: 120,
    prop: "parent_id",
    valueType: "copy"
  },
  {
    label: "是否生效",
    width: 100,
    prop: "status",
    valueType: "switch"
  }
];

const handleConfirm = (values: any) => {
  if (menuTableStore.type) {
    menuTableStore.UpdateMenu(values);
  } else {
    menuTableStore.AddMenu(values);
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
  visible.value = menuTableStore.display;
  form.value = {
    menu_id: menuTableStore.rowData.menu_id,
    menu_name: menuTableStore.rowData.menu_name,
    menu_desc: menuTableStore.rowData.menu_desc,
    status: menuTableStore.rowData.status,
    menu_identifier: menuTableStore.rowData.menu_identifier,
    menu_path: menuTableStore.rowData.menu_path,
    menu_icon: menuTableStore.rowData.menu_icon,
    menu_component: menuTableStore.rowData.menu_component,
    menu_type: menuTableStore.rowData.menu_type,
    menu_sort: menuTableStore.rowData.menu_sort,
    parent_id: menuTableStore.rowData.parent_id
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
    :form="{ columns }"
    @confirm="handleConfirm"
  >
    <template #dialog-header> 更改菜单 </template>
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
