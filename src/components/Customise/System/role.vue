<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import "plus-pro-components/es/components/dialog-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";
import { useRoleTableStore } from "@/store/modules/customise/role";
import { FormRules } from "element-plus";
const roleTableStore = useRoleTableStore();
const visible = ref(false);
const form = ref<FieldValues>(null);
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

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      trigger: "blur",
      message: "请输入角色名称"
    }
  ]
});

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
    id: roleTableStore.rowData.id,
    name: roleTableStore.rowData.name,
    description: roleTableStore.rowData.description,
    status: roleTableStore.rowData.status,
    identifier: roleTableStore.rowData.identifier
  };

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
    :form="{
      columns,
      rules,
      labelWidth: '100px',
      labelPosition: 'right'
    }"
    @confirm="handleConfirm"
  >
    <template #dialog-header> 更改角色 </template>
    <template #dialog-footer="{ handleConfirm, handleCancel }">
      <el-button @click="handleCancel">取消</el-button>
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
    </template>
  </PlusDialogForm>
</template>
