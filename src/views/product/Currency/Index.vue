<script setup lang="ts">
import {
  computed,
  defineComponent,
  InjectionKey,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  ref
} from "vue";
import { useCurrencyStore } from "./CoreModules/store";
import CurrencyDialog from "./components/CurrencyDialog.vue";
import { CurrencyTypes, synchronousCurrency } from "@/api/currency";
import { cloneDeep } from "@pureadmin/utils";
import IconContainer from "./components/IconContainer.vue";
import {
  EditCurrencyFunction,
  editCurrencyKey,
  StarChangeFunction,
  starChangeKey
} from "./CoreModules/types";

defineComponent({
  name: "ProductCurrency"
});

interface stateProps {
  synchronousLoading: boolean;
  confirmLoading: boolean;
  stars: {
    [key: string]: boolean;
  };
}

const defaultState: stateProps = {
  synchronousLoading: false,
  confirmLoading: false,
  stars: {}
};

const currencyStore = useCurrencyStore();

const currencyDiaRef = ref(null);
const state = reactive(cloneDeep(defaultState));

const currencyData = computed(() => {
  const data = currencyStore.$state.store.currencyData;
  // const checkStars = data
  //   .flatMap(item => (state.stars[item.id] ? [item] : []))
  //   .sort((a, b) => a.sort - b.sort);

  // const endData = checkStars.concat(data.filter(c => !state.stars[c.id]));

  // return endData;
  return data.filter(c => !state.stars[c.id]);
});
const starCurrencyData = computed(() => {
  console.log("true");

  const data = currencyStore.$state.store.currencyData;
  const checkStars = data
    .flatMap(item => (state.stars[item.id] ? [item] : []))
    .sort((a, b) => a.sort - b.sort);

  console.log(checkStars, "start");

  return checkStars;
});

const editCurrency: EditCurrencyFunction = (row: CurrencyTypes) => {
  currencyStore.$state.store.rowData = row;
  currencyDiaRef.value.open();
};

const starChange: StarChangeFunction = (row: CurrencyTypes) => {
  const stars = state.stars;

  const status = !!stars[row.id];
  state.stars[row.id] = !status;
  localStorage.setItem("stars", JSON.stringify(state.stars));
};

/* 同步货币信息 */
const handleSynchronousCurrency = async () => {
  state.synchronousLoading = true;
  await synchronousCurrency();
  state.synchronousLoading = false;
};

onMounted(() => {
  currencyStore.initCurrency();
  const storageStars = localStorage.getItem("stars");
  if (storageStars) {
    state.stars = JSON.parse(storageStars);
  }
});

onUnmounted(() => {
  localStorage.setItem("stars", JSON.stringify(state.stars));
});

provide(editCurrencyKey, editCurrency);
provide(starChangeKey, starChange);
</script>

<template>
  <div class="currency-warpper main">
    <div class="uptate-currency-warpper">
      <el-button
        :loading="state.synchronousLoading"
        type="primary"
        @click="handleSynchronousCurrency"
        >同步货币信息</el-button
      >
    </div>
    <el-card v-if="starCurrencyData.length > 0" class="mb-4">
      <template #header>
        <div class="card-header">
          <h3>收藏</h3>
        </div>
      </template>
      <IconContainer :data="starCurrencyData" :stars="state.stars" />
    </el-card>
    <IconContainer :data="currencyData" :stars="state.stars" />
    <CurrencyDialog ref="currencyDiaRef" />
  </div>
</template>

<style lang="scss" scoped>
.currency-warpper {
  height: calc(100% - 48px);

  .uptate-currency-warpper {
    margin-bottom: 20px;
  }

  :deep(.el-card) {
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>
