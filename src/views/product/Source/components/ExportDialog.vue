<script setup lang="tsx">
import { type PlusStepFromRow, PlusStepsForm } from "plus-pro-components";
import { computed, reactive, ref } from "vue";
import useSourceStore from "../modules/store";
import "plus-pro-components/index.css";
import CardSelect from "./cardSelect.vue";

const sourceStore = useSourceStore();

const state = reactive({
  visible: false,
  active: 1
});

const categoryData = computed(() => sourceStore.$state.state.categoryData);
const brandData = computed(() => sourceStore.$state.state.brandData);

const form = ref({
  searchCurrencyName: "",
  typeId: "",
  brandId: "",
  currencyName: ""
});

const stepForm = ref<PlusStepFromRow[]>([
  {
    title: "第一步",
    form: {
      modelValue: form.value,
      defaultValues: form.value,
      footerAlign: "right",
      columns: [
        {
          label: "类别",
          prop: "typeId",
          valueType: "tree-select",
          fieldProps: {
            data: computed(() => categoryData.value),
            showCheckbox: true,
            defaultExpandAll: true,
            clearable: false,
            multiple: false,
            checkStrictly: true,
            style: {
              width: "100%"
            }
          }
        },
        {
          label: "品牌",
          prop: "brandId",
          valueType: "select",
          fieldProps: {
            clearable: true
          },
          options: computed(() => brandData.value)
        }
      ],
      rules: {
        typeId: [
          {
            required: true,
            message: "请选择类别"
          }
        ],
        brandId: [
          {
            required: true,
            message: "请选择品牌"
          }
        ]
      }
    }
  },
  {
    title: "第二步",
    form: {
      labelWidth: "100",
      modelValue: form.value,
      defaultValues: form.value,
      footerAlign: "right",
      columns: [
        {
          label: "搜索货币",
          prop: "searchCurrencyName",
          valueType: "input"
        },
        {
          label: "货币",
          prop: "currencyName",
          renderField: (value, onChange) => {
            return (
              <CardSelect
                keyword={form.value.searchCurrencyName}
                modelValue={value}
                onChange={onChange}
              />
            );
          }
        }
      ],
      rules: {
        currencyName: [
          {
            required: true,
            // 写着玩的校验
            validator: (rule: any, value: any, callback: any) => {
              if (!value) {
                return callback(new Error("请选择货币"));
              }
            }
          }
        ]
      }
    }
  }
]);

const handleCalcel = () => {
  state.visible = false;
};

const open = () => {
  state.visible = true;
};

const next = (actives: number, values: any) => {
  state.active = actives;
  console.log("============", {
    actives,
    values
  });
};
const handleChange = values => {
  form.value = {
    ...form.value,
    ...values
  };
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog
    v-model="state.visible"
    title="导出"
    width="800"
    :close-on-click-modal="false"
    :close="handleCalcel"
  >
    <PlusStepsForm
      v-model="state.active"
      pre-text="上一步"
      next-text="下一步"
      submit-text="确定"
      :data="stepForm"
      @change="handleChange"
      @next="next"
    />
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-steps) {
  width: 60%;
  margin: 0 auto;
  margin-bottom: 20px;
}
</style>
