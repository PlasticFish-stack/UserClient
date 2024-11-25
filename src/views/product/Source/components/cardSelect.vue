<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import useSourceStore from "../modules/store";
import { cloneDeep } from "@pureadmin/utils";

import Card from "./card.vue";

interface Props {
  keyword: string;
  modelValue: any;
  onChange: (val: any) => void;
}

const props = withDefaults(defineProps<Props>(), {
  keyword: "",
  modelValue: ""
});

const emit = defineEmits(["update:modelValue"]);

interface stateProps {
  stars: {
    [key: string]: boolean;
  };
  checked: boolean;
}

const defaultState: stateProps = {
  stars: {},
  checked: false
};

const sourceStore = useSourceStore();
const state = reactive(cloneDeep(defaultState));

const checkWord = (item, key) => {
  return (
    item[key].toLocaleLowerCase().indexOf(props.keyword.toLocaleLowerCase()) >=
    0
  );
};

const checkKeyword = data => {
  return data.filter(item => {
    let checkCurrencyName = checkWord(item, "currencyName");
    let checkDescriptionCn = checkWord(item, "descriptionCn");
    let checkDescriptionEn = checkWord(item, "descriptionEn");
    return checkCurrencyName || checkDescriptionCn || checkDescriptionEn;
  });
};

/* 未收藏货币 */
const currencyData = computed(() => {
  let data = sourceStore.$state.state.currencyData;

  data = data
    .filter(c => !state.stars[c.id])
    .sort((a, b) => (b.countryIcon ? 1 : 0) - (a.countryIcon ? 1 : 0));

  if (props.keyword) {
    data = checkKeyword(data);
  }
  return data;
});

/* 收藏货币 */
const starCurrencyData = computed(() => {
  const data = sourceStore.$state.state.currencyData;

  let checkStars = data
    .flatMap(item => (state.stars[item.id] ? [item] : []))
    .sort((a, b) => a.sort - b.sort);

  if (props.keyword) {
    checkStars = checkKeyword(checkStars);
  }
  return checkStars;
});

onMounted(() => {
  const storageStars = localStorage.getItem("stars");
  if (storageStars) {
    state.stars = JSON.parse(storageStars);
  }
});
</script>

<template>
  <!-- 收藏 -->
  <el-card v-if="starCurrencyData.length > 0" class="mb-4 w-[100%]">
    <template #header>
      <div class="card-header">
        <h3>收藏</h3>
      </div>
    </template>
    <el-scrollbar height="120px">
      <div class="flex items-center gap-[8px] flex-wrap overflow-auto">
        <Card
          :data="starCurrencyData"
          :model-value="props.modelValue"
          :onChange="props.onChange"
        />
      </div>
    </el-scrollbar>
  </el-card>

  <!-- 未收藏 -->
  <div class="overflow-hidden">
    <el-scrollbar height="200px">
      <div class="flex items-center gap-[8px] flex-wrap overflow-auto">
        <Card
          :data="currencyData"
          :model-value="props.modelValue"
          :onChange="props.onChange"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  .plus-check-card--default {
    width: 306px;
    height: 110px;
  }
}

:deep(.el-card__header) {
  padding: 10px;
}
:deep(.plus-check-card--default) {
  width: 310px;
  height: 110px;
}

.svg-container {
  width: 100px;
  height: 70px;
}
</style>
