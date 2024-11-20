<script setup lang="ts">
import {
  type PlusColumn,
  FieldValues,
  PlusDialogForm
} from "plus-pro-components";
import { reactive, ref } from "vue";

const state = reactive({
  visible: false
});

const form = ref(null);

const rules = {
  name: [
    {
      required: true,
      message: "请输入名称"
    }
  ],
  tag: [
    {
      required: true,
      message: "请输入标签"
    }
  ]
};
const columns: PlusColumn[] = reactive([
  {
    label: "货币",
    prop: "name",
    valueType: "select"
  },
  {
    label: "类别",
    prop: "typeId",
    valueType: "select"
  },
  {
    label: "品牌",
    prop: "brandId",
    valueType: "select"
  }
]);

const open = () => {
  state.visible = true;
};

defineExpose({
  open
});
</script>

<template>
  <PlusDialogForm
    v-model:visible="state.visible"
    v-model="form"
    :form="{ columns, rules }"
  />
</template>

<style lang="scss" scoped></style>
