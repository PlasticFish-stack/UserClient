<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useUserTableStore } from "../CoreModules/store";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";
const userTableStore = useUserTableStore();
const visible = ref<boolean>(false);

const form = ref(null);

const columns: PlusColumn[] = reactive([
  {
    label: "用户名称",
    prop: "name",
    valueType: "input",
    fieldProps: {
      disabled: true
    }
  }
]);

const open = () => {
  visible.value = true;
};

const handleCancel = () => {
  visible.value = false;
  console.log("============");
};
const handleConfirm = (values: any) => {
  console.log("values============", values);
  handleCancel();
};

defineExpose({
  open
});
</script>

<template>
  <PlusDialogForm
    v-model:visible="visible"
    v-model="form"
    title="角色菜单绑定"
    style="border-radius: 8px"
    :form="{ columns }"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  />
</template>

<style lang="scss" scoped></style>
