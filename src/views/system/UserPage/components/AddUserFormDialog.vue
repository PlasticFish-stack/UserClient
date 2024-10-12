<script setup lang="ts">
import { computed, ref } from "vue";
import { useUserTableStore } from "../CoreModules/store";
import { FieldValues, PlusColumn, PlusDialogForm } from "plus-pro-components";

const userTableStore = useUserTableStore();

const form = ref<FieldValues>(null);

const visible = computed(() => userTableStore.$state.state.userDialog);
const title = computed(() =>
  userTableStore.$state.state.type ? "查看用户" : "新建用户"
);

const columns: PlusColumn[] = [
  {
    label: "角色名称",
    prop: "name",
    valueType: "copy"
  },
  {
    label: "角色标识",
    prop: "identifier",
    valueType: "copy"
  },
  {
    label: "角色简介",
    prop: "description",
    valueType: "textarea",
    fieldProps: {
      width: 180,
      maxlength: 200
      // showWordLimit: true,
      // autosize: { minRows: 2, maxRows: 4 }
    }
  },
  {
    label: "是否生效",
    prop: "status",
    valueType: "switch"
  }
];

const handleConfirm = (values: any) => {
  console.log("=========", values);
};
</script>

<template>
  <PlusDialogForm
    v-model:visible="visible"
    v-model="form"
    style="border-radius: 8px"
    :form="{
      columns,
      labelWidth: '100px',
      labelPosition: 'right'
    }"
    @confirm="handleConfirm"
  >
    <template #dialog-header> {{ title }} </template>
  </PlusDialogForm>
</template>

<style lang="scss" scoped></style>
