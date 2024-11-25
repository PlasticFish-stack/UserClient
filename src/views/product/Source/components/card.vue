<script setup lang="tsx">
import type { CurrencyTypes } from "@/api/currency";
import { PlusCheckCardGroup } from "plus-pro-components";
import Icon from "@/views/product/Currency/components/Icon.vue";
import { ref, watch } from "vue";
import { cloneDeep } from "@pureadmin/utils";

interface Props {
  data: CurrencyTypes[];
  modelValue: any;
  onChange: (val: any) => void;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  modelValue: ""
});

const currencyData = ref<any>([]);
const modelValue = ref(props.modelValue);

const handleChange = val => {
  props.onChange && props.onChange(val);
};

watch(
  () => props.modelValue,
  val => {
    modelValue.value = val;
  },
  {
    immediate: true
  }
);

watch(
  () => props.data,
  renderData => {
    const data = cloneDeep(renderData);
    currencyData.value = data.map(item => {
      return {
        ...item,
        value: item.currencyName,
        avatar: () => (
          <div class="svg-container">
            <Icon name={item.countryIcon} />
          </div>
        ),
        title: () => (
          <div class="flex direction-column items-center justify-between w-[100%]">
            <div>
              <h3>{item.currencyName}</h3>
              <h4>{item.descriptionCn || "-"}</h4>
            </div>
            <div class="h-[100%]">
              <h3>{item.country}</h3>
              <h3>{item.cost}</h3>
            </div>
          </div>
        )
      };
    });
  },
  {
    immediate: true
  }
);
</script>

<template>
  <PlusCheckCardGroup
    v-model:model-value="modelValue"
    :multiple="false"
    :options="currencyData"
    @change="handleChange"
  />
</template>

<style lang="scss" scoped>
:deep(.plus-check-card__title) {
  height: 100%;
}
:deep(.plus-check-card__title-left) {
  flex: 1;
}
h4 {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
