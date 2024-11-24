<script setup lang="ts">
import { computed, reactive } from "vue";
import useSourceStore from "../modules/store";
import { cloneDeep } from "@pureadmin/utils";

interface stateProps {
  stars: {
    [key: string]: boolean;
  };
}

const defaultState: stateProps = {
  stars: {}
};

const sourceStore = useSourceStore();
const state = reactive(cloneDeep(defaultState));

/* 未收藏货币 */
const currencyData = computed(() => {
  const data = sourceStore.$state.state.currencyData;
  return data.filter(c => !state.stars[c.id]);
});

/* 收藏货币 */
const starCurrencyData = computed(() => {
  const data = sourceStore.$state.state.currencyData;
  const checkStars = data
    .flatMap(item => (state.stars[item.id] ? [item] : []))
    .sort((a, b) => a.sort - b.sort);
  return checkStars;
});
</script>

<template>
  <div>test</div>
</template>

<style lang="scss" scoped></style>
