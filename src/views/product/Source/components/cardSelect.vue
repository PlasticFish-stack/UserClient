<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import useSourceStore from "../modules/store";
import { cloneDeep } from "@pureadmin/utils";

import Card from "./card.vue";

interface Props {
  keyword: string;
}

const props = withDefaults(defineProps<Props>(), {
  keyword: ""
});

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

/* 未收藏货币 */
const currencyData = computed(() => {
  const data = sourceStore.$state.state.currencyData;
  return data
    .filter(c => !state.stars[c.id])
    .sort((a, b) => (b.countryIcon ? 1 : 0) - (a.countryIcon ? 1 : 0));
});

/* 收藏货币 */
const starCurrencyData = computed(() => {
  const data = sourceStore.$state.state.currencyData;
  const checkStars = data
    .flatMap(item => (state.stars[item.id] ? [item] : []))
    .sort((a, b) => a.sort - b.sort);
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
    <div
      class="flex items-center gap-[8px] flex-wrap overflow-auto"
      style="max-height: 240px"
    >
      <Card :data="starCurrencyData" />
    </div>
  </el-card>

  <!-- 未收藏 -->
  <div
    class="flex items-center gap-[8px] flex-wrap overflow-auto"
    style="max-height: 400px"
  >
    <Card :data="currencyData" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  .plus-check-card--default {
    width: 310px;
    height: 110px;
  }
}

:deep(.el-card__header) {
  padding: 10px;
}

.svg-container {
  width: 100px;
  height: 70px;
}
</style>
