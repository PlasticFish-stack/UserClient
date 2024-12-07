<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import useInformationStore from "../modules/store";
import {
  handleInformationAdd,
  handleInformationUpdate,
  type InformationTypes
} from "@/api/information";
import { PlusColumn, PlusDrawerForm } from "plus-pro-components";
import { useOptionsColumns } from "../modules/optionsConfig";
import { FormRules } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import { successMes } from "@/utils/globalReqMes";
import { getKeyParams } from "@/utils/globalUtils";
import { useColumns } from "../modules/config";

const informationStore = useInformationStore();
const { pagination } = useColumns(null, null);
const { columns: optionsColumns } = useOptionsColumns();

const state = reactive({
  visable: false,
  optionsData: [],
  loading: false
});

const form = ref<InformationTypes>(null);

const title = computed(
  () =>
    (informationStore.$state.state.type === "Add" ? "新增" : "编辑") +
    "品牌信息"
);

const categoryData = computed(() => informationStore.$state.state.categoryData);
const brandData = computed(() => informationStore.$state.state.brandData);
const categoryMapping = computed(
  () => informationStore.$state.state.categoryMapping
);

const rules = reactive<FormRules>({
  itemNumber: [
    {
      required: true,
      trigger: "blur",
      message: "请输入货号"
    }
  ],
  typeId: [
    {
      required: true,
      trigger: "blur",
      message: "请选择产品类别"
    }
  ],
  brandId: [
    {
      required: true,
      trigger: "blur",
      message: "请选择品牌"
    }
  ],
  quantity: [{ type: "number", message: "税率必须为数字" }]
});

const columns = reactive<PlusColumn[]>([
  {
    label: "货号",
    prop: "itemNumber",
    valueType: "input"
  },
  {
    label: "产品类别",
    prop: "typeId",
    valueType: "tree-select",
    colProps: {
      span: 12
    },
    fieldProps: {
      data: computed(() => categoryData.value),
      showCheckbox: true,
      defaultExpandAll: true,
      clearable: false,
      multiple: false,
      checkStrictly: true,
      style: {
        width: "100%"
      },
      onChange: () => {
        handleTypeChange(form.value.typeId);
      }
    }
  },
  {
    label: "品牌",
    prop: "brandId",
    valueType: "select",
    colProps: {
      span: 12
    },
    fieldProps: {
      clearable: true
    },
    options: computed(() => brandData.value)
  },
  {
    label: "sku",
    prop: "sku",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "spu",
    prop: "spu",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "数量",
    prop: "quantity",
    valueType: "input-number",
    colProps: {
      span: 12
    }
  },
  {
    label: "规格",
    prop: "specifications",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "条形码",
    prop: "barcode",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "海关编码",
    prop: "customscode",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "描述",
    prop: "description",
    valueType: "input"
  },
  {
    label: "颜色",
    prop: "color",
    valueType: "input",
    colProps: {
      span: 12
    }
  },
  {
    label: "产品字段",
    prop: "options"
  }
]);

const handleIntegrationOptions = options => {
  return Object.keys(options).map(key => {
    return {
      name: key,
      value: options[key]
    };
  });
};

const initOptionsData = options => {
  state.optionsData = options;
};

const initOptions = options => {
  const data = handleIntegrationOptions(options);
  initOptionsData(data);
};

const handleTypeChange = (type, initialOptionsData?) => {
  const optionsData = initialOptionsData || state.optionsData;
  const fields =
    categoryMapping.value?.[type] && categoryMapping.value?.[type].fields;
  if (!fields) return;

  const comOptionsMapping = optionsData.reduce((pre, cur) => {
    return {
      ...pre,
      [cur.name]: cur.value
    };
  }, {});

  const integrationOptions = fields.reduce((pre, cur) => {
    return {
      ...pre,
      [cur.name]: comOptionsMapping[cur.name] || ""
    };
  }, {});
  initOptions(integrationOptions);
};

const open = () => {
  state.visable = true;
  const curInformation = cloneDeep(
    informationStore.$state.state.curInformation
  );

  form.value = curInformation;

  const type = informationStore.$state.state.type === "Add";
  if (!type) {
    handleTypeChange(
      curInformation.typeId,
      handleIntegrationOptions(curInformation.options)
    );
  }
};

const handleCancel = () => {
  state.visable = false;
  form.value = null;
  state.optionsData = [];
  informationStore.initCurInformation(null);
};

const handleConfirm = async values => {
  const data = getKeyParams(values, [
    "itemNumber",
    "brandId",
    "sku",
    "spu",
    "quantity",
    "specifications",
    "barcode",
    "customscode",
    "description",
    "color",
    "dwPrice",
    "typeId"
  ]);
  data["options"] = state.optionsData.reduce((pre, cur) => {
    return {
      ...pre,
      [cur.name]: cur.value
    };
  }, {});

  const type = informationStore.$state.state.type === "Add";

  let res;

  if (type) {
    res = await handleInformationAdd(data);
  } else {
    res = await handleInformationUpdate(data);
  }
  if (res.success) {
    informationStore.initInformation({
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    successMes(res.data);
    handleCancel();
  }
};

defineExpose({
  open
});
</script>

<template>
  <PlusDrawerForm
    v-model:visible="state.visable"
    v-model="form"
    size="800px"
    :title="title"
    :form="{
      columns,
      rules,
      rowProps: { gutter: 8 },
      labelWidth: '100px'
    }"
    cancel-text="取消"
    confirm-text="确定"
    :confirm-loading="state.loading"
    :closeOnClickModal="false"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #plus-field-options>
      <pure-table
        border
        stripe
        :data="state.optionsData"
        :columns="optionsColumns"
      />
    </template>
  </PlusDrawerForm>
</template>

<style lang="scss" scoped></style>
