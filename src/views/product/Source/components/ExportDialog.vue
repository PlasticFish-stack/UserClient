<script setup lang="tsx">
import { type PlusStepFromRow, PlusStepsForm } from "plus-pro-components";
import { computed, markRaw, reactive, ref, shallowRef } from "vue";
import useSourceStore from "../modules/store";
import "plus-pro-components/index.css";
import CardSelect from "./cardSelect.vue";
import { downloadExortDemo } from "@/api/source";
import { errorMes, successMes } from "@/utils/globalReqMes";
import { cloneDeep } from "@pureadmin/utils";
import { SuccessFilled } from "@element-plus/icons-vue";
import { getKeyParams } from "@/utils/globalUtils";

const defaultForm = {
  searchCurrencyName: "",
  productTypeId: "",
  productBrandId: "",
  currencyName: ""
};

const sourceStore = useSourceStore();

const state = reactive({
  visible: false,
  active: 1,
  loading: false
});

const categoryData = computed(() => sourceStore.$state.state.categoryData);
const brandData = computed(() => sourceStore.$state.state.brandData);

const form = ref(cloneDeep(defaultForm));

const CardContiner = markRaw(CardSelect);

const stepForm = shallowRef<PlusStepFromRow[]>([
  {
    title: "第一步",
    form: {
      modelValue: form.value,
      defaultValues: form.value,
      footerAlign: "right",
      columns: [
        {
          label: "类别",
          prop: "productTypeId",
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
          prop: "productBrandId",
          valueType: "select",
          fieldProps: {
            clearable: true
          },
          options: computed(() => brandData.value)
        }
      ],
      rules: {
        productTypeId: [
          {
            required: true,
            message: "请选择类别"
          }
        ],
        productBrandId: [
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
              <CardContiner
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
            // message: "请选择货币",
            // 写着玩的校验
            validator: (rule: any, value: any, callback: any) => {
              if (!value) {
                return callback(new Error("请选择货币"));
              }
              callback();
            }
          }
        ]
      }
    }
  },
  {
    title: "完成",
    icon: SuccessFilled,
    form: {}
  }
]);

const handleCalcel = () => {
  form.value = {
    ...cloneDeep(defaultForm)
  };
  state.active = 1;

  state.visible = false;
};

const open = () => {
  state.visible = true;
};

const next = async (actives: number) => {
  if (actives === 3) {
    state.loading = true;
    try {
      const res: any = await downloadExortDemo(
        getKeyParams(form.value, [
          "productTypeId",
          "productBrandId",
          "currencyName"
        ])
      );

      if (res) {
        state.active = actives;
        successMes("导出成功!");
        handleCalcel();
        state.loading = false;
      } else {
        state.active = 2;
        state.loading = false;
      }
    } catch (e) {
      state.active = 2;
      state.loading = false;
    }
  } else {
    state.active = actives;
  }
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
    destroy-on-close
    :close-on-click-modal="false"
    :close="handleCalcel"
  >
    <PlusStepsForm
      v-model="state.active"
      v-loading="state.loading"
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
