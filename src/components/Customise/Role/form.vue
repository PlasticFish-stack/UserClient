<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RoleResult, updateRole } from "@/api/role";
import "plus-pro-components/es/components/dialog-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";
const props = defineProps({
  display: Boolean,
  rows: Object
});
const emits = defineEmits(["target", "msg"]);
const visible = ref(false);
let cutstom: any = [];
const form = ref<FieldValues>(null);
const columns: PlusColumn[] = [
  {
    label: "角色名称",
    width: 120,
    prop: "role_name",
    valueType: "copy"
  },
  {
    label: "角色标识",
    width: 120,
    prop: "role_identifier",
    valueType: "copy"
  },
  {
    label: "角色简介",
    prop: "role_desc",
    valueType: "textarea",
    fieldProps: {
      maxlength: 200
      // showWordLimit: true,
      // autosize: { minRows: 2, maxRows: 4 }
    }
  },
  {
    label: "是否生效",
    width: 100,
    prop: "status",
    valueType: "switch"
  }
];
async function roleList(roles) {
  try {
    await updateRole(roles);
    emits("msg", true, "更新角色成功");
  } catch (error) {
    console.log(error);
    emits("msg", false, "更新角色失败");
  } finally {
    visible.value = false;
  }
}
const handleConfirm = (values: any) => {
  roleList(values);
  console.log(values, "change");
};
onMounted(() => {
  visible.value = props.display;
  form.value = {
    role_id: props.rows.role_id,
    role_name: props.rows.role_name,
    role_desc: props.rows.role_desc,
    status: props.rows.status,
    role_identifier: props.rows.role_identifier
  };
  console.log(form.value, "rows");

  watch(
    () => props.display,
    newVal => {
      if (visible.value != props.display) {
        visible.value = newVal;
      }
    }
  );
  watch(
    () => visible.value,
    newVal => {
      if (visible.value == false && props.display == true) {
        cutstom = emits("target");
        console.log(cutstom);
      }
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
    <template #dialog-header> 更改角色 </template>
    <template #dialog-footer="{ handleConfirm, handleCancel }">
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button type="warning" @click="handleCancel">取消</el-button>
    </template>
  </PlusDialogForm>
</template>
