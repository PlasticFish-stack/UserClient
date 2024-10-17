<script setup lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useCurrencyStore } from "./CoreModules/store";

defineComponent({
  name: "ProductCurrency"
});

// const defaultState = {};

const currencyStore = useCurrencyStore();

const currencyData = computed(() => currencyStore.$state.store.currencyData);

onMounted(() => {
  currencyStore.initCurrency();
});
</script>

<template>
  <div class="currency-warpper main">
    <el-row :gutter="20">
      <el-col
        v-for="item in currencyData"
        :key="item.id"
        :span="3"
        :xs="8"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="2"
      >
        <div class="currency-container">
          <img src="" alt="" />
          <div>{{ item.currencyName }}</div>
          <div>{{ item.descriptionCn }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.currency-warpper {
  height: calc(100% - 48px);

  .currency-container {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: aqua;
    margin-bottom: 20px;
  }
}
</style>
