<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import "plus-pro-components/es/components/dialog-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";
import { useRoleTableStore } from "@/store/modules/customise/role";
const roleTableStore = useRoleTableStore();
const visible = ref(false);
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

const handleConfirm = (values: any) => {
  if (roleTableStore.type) {
    roleTableStore.UpdateRole(values);
  } else {
    roleTableStore.AddRole(values);
  }
  visible.value = false;
};
onMounted(() => {
  visible.value = roleTableStore.display;
  form.value = {
    role_id: roleTableStore.rowData.role_id,
    role_name: roleTableStore.rowData.role_name,
    role_desc: roleTableStore.rowData.role_desc,
    status: roleTableStore.rowData.status,
    role_identifier: roleTableStore.rowData.role_identifier
  };
  console.log(roleTableStore.rowData, "rows");
  watch(
    () => visible.value,
    newVal => {
      roleTableStore.displayTarget(newVal);
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
      <el-button
        type="primary"
        :loading="roleTableStore.optionLoading"
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
