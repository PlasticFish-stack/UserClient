<script setup lang="tsx">
import {
  type PlusStepFromRow,
  PlusStepsForm,
  PlusCheckCardGroup
} from "plus-pro-components";
import { computed, reactive, ref } from "vue";
import useSourceStore from "../modules/store";

const sourceStore = useSourceStore();

const state = reactive({
  visible: false,
  active: 1
});

const categoryData = computed(() => sourceStore.$state.state.categoryData);
const brandData = computed(() => sourceStore.$state.state.brandData);

const form = ref(null);

const options = [
  {
    title: "title0",
    value: "0",
    description: "description0",
    avatar:
      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
  },
  {
    title: "title1",
    value: "1",
    description: "description1",
    avatar:
      "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
  }
];

const stepForm = ref<PlusStepFromRow[]>([
  {
    title: "第一步",
    form: {
      modelValue: {},
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
      modelValue: {},
      columns: [
        {
          label: "货币",
          prop: "name",
          renderField: () => {
            return <PlusCheckCardGroup options={options} size="small" />;
          }
        }
      ],
      rules: {}
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
  console.log(state.active, values, form.value);
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
    :close="handleCalcel"
  >
    <PlusStepsForm
      v-model="state.active"
      pre-text="上一步"
      next-text="下一步"
      submit-text="确定"
      :data="stepForm"
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
