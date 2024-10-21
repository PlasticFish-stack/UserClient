<script setup lang="ts">
import { CurrencyTypes, updateCurrency } from "@/api/currency";
import { resetReactiveState } from "@/utils/globalUtils";
import { cloneDeep } from "@pureadmin/utils";
import { PlusColumn, PlusDialogForm } from "plus-pro-components";
import { reactive } from "vue";
import { useCurrencyStore } from "../CoreModules/store";
import { successMes } from "@/utils/globalReqMes";

interface stateProps {
  visible: boolean;
  form: {
    sort: number;
  } & {
    // 使用类型断言来包含CurrencyTypes中的所有属性
    [key in keyof CurrencyTypes]?: CurrencyTypes[key];
  };
  confirmLoading: boolean;
}

const columns: PlusColumn[] = [
  {
    label: "货币名称",
    prop: "currencyName",
    valueType: "input",
    fieldProps: {
      disabled: true
    }
  },
  {
    label: "中文描述",
    prop: "descriptionCn",
    valueType: "input"
  },
  {
    label: "英文描述",
    prop: "descriptionEn",
    valueType: "input"
  },
  {
    label: "货币简称",
    prop: "countryIcon",
    valueType: "input"
  },
  {
    label: "排序",
    prop: "sort",
    valueType: "input-number"
  }
];

const defaultState: stateProps = {
  visible: false,
  form: {
    currencyName: "",
    descriptionEn: "",
    descriptionCn: "",
    countryIcon: "",
    sort: 0
  },
  confirmLoading: false
};

const currencyStore = useCurrencyStore();

const state = reactive(cloneDeep(defaultState));

const handleCancel = () => {
  resetReactiveState(state, defaultState);
};

const handleConfirm = async () => {
  const row = currencyStore.$state.store.rowData;

  const data = {
    id: row.id,
    ...state.form
  };

  const res = await updateCurrency(data);

  if (res.success) {
    successMes();
  }
};

const open = () => {
  const row = currencyStore.$state.store.rowData;
  const { currencyName, countryIcon, descriptionCn, descriptionEn } = row;
  console.log("+===========", {
    currencyName,
    countryIcon,
    descriptionCn,
    descriptionEn
  });
  state.form = {
    currencyName,
    countryIcon,
    descriptionCn,
    descriptionEn
  };

  state.visible = true;
};

defineExpose({
  open
});
</script>

<template>
  <PlusDialogForm
    v-model:visible="state.visible"
    v-model="state.form"
    title="角色菜单绑定"
    style="border-radius: 8px"
    :form="{ columns }"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #dialog-footer="{ handleConfirm, handleCancel }">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        v-loading="state.confirmLoading"
        type="primary"
        @click="handleConfirm"
      >
        确定
      </el-button>
    </template>
  </PlusDialogForm>
</template>

<style lang="scss" scoped></style>
