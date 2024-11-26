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
const region = [
  { value: "亚洲", label: "亚洲" },
  { value: "中东", label: "中东" },
  { value: "北非", label: "北非" },
  { value: "西非", label: "西非" },
  { value: "中非", label: "中非" },
  { value: "南非", label: "南非" },
  { value: "东非", label: "东非" },
  { value: "北美", label: "北美" },
  { value: "中美", label: "中美" },
  { value: "南美", label: "南美" },
  { value: "加勒比", label: "加勒比" },
  { value: "欧洲", label: "欧洲" },
  { value: "大洋洲", label: "大洋洲" }
];
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
    label: "使用地区",
    prop: "organization",
    valueType: "select",
    options: region
  },
  {
    label: "发行地",
    prop: "country",
    valueType: "input"
  },
  {
    label: "货币简称",
    prop: "countryIcon",
    valueType: "input"
  }
  /* {
    label: "排序",
    prop: "sort",
    valueType: "input-number",
    fieldProps: {
      min: 0
    }
  } */
];

const defaultState: stateProps = {
  visible: false,
  form: {
    currencyName: "",
    descriptionEn: "",
    descriptionCn: "",
    countryIcon: "",
    country: "",
    organization: "",
    sort: 0
  },
  confirmLoading: false
};

const currencyStore = useCurrencyStore();

const state = reactive(cloneDeep(defaultState));

const handleCancel = () => {
  resetReactiveState(state, defaultState);

  state.visible = false;
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
    handleCancel();
    currencyStore.initCurrency();
  }
};

const open = () => {
  const row = currencyStore.$state.store.rowData;
  const {
    currencyName,
    countryIcon,
    descriptionCn,
    descriptionEn,
    sort,
    country,
    organization
  } = row;
  state.form = {
    currencyName,
    countryIcon,
    descriptionCn,
    descriptionEn,
    organization,
    country,
    sort
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
