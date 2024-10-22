<script setup lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useCurrencyStore } from "./CoreModules/store";
import { Edit } from "@element-plus/icons-vue";
import CurrencyDialog from "./components/CurrencyDialog.vue";
import { CurrencyTypes, synchronousCurrency } from "@/api/currency";
import { cloneDeep } from "@pureadmin/utils";
import Icon from "./components/Icon.vue";
import CN from "@/assets/flags/4x3/cn.svg?component";

defineComponent({
  name: "ProductCurrency"
});

interface stateProps {
  synchronousLoading: boolean;
  confirmLoading: boolean;
}

const defaultState: stateProps = {
  synchronousLoading: false,
  confirmLoading: false
};

const currencyStore = useCurrencyStore();

const currencyDiaRef = ref(null);
const state = reactive(cloneDeep(defaultState));

const currencyData = computed(() => currencyStore.$state.store.currencyData);

const editCurrency = (row: CurrencyTypes) => {
  currencyStore.$state.store.rowData = row;
  currencyDiaRef.value.open();
};

/* 同步货币信息 */
const handleSynchronousCurrency = async () => {
  state.synchronousLoading = true;
  await synchronousCurrency();
  state.synchronousLoading = false;
};

onMounted(() => {
  currencyStore.initCurrency();
});
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
          <!-- {{ item.countryIcon }} -->
          <!-- <CN class="CN" /> -->
          <div class="svg-container">
            <Icon :name="item.countryIcon" />
          </div>

          <div class="name">{{ item.currencyName }}</div>
          <div class="des">{{ item.descriptionCn || "-" }}</div>

          <div class="edit">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              @click="() => editCurrency(item)"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <CurrencyDialog ref="currencyDiaRef" />
  </div>
</template>

<style lang="scss" scoped>
.currency-warpper {
  height: calc(100% - 48px);

  .uptate-currency-warpper {
    margin-bottom: 20px;
  }

  .currency-container {
    height: 175px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    border: 2px solid rgba(204, 204, 204, 0.8);
    border-radius: 10px;
    padding: 20px;
    transition: 0.2s;
    position: relative;

    &:hover {
      box-shadow: 0px 7px 30px 0px rgba(100, 100, 111, 0.4);

      .edit {
        display: block;
      }
    }

    .svg-container {
      width: 100px;
      height: 60px;
    }

    .name,
    .des {
      max-width: calc(100% - 10px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowarp;
      margin-top: 10px;
    }

    .name {
      font-size: 16px;
      color: #0d0d0d;
    }

    .des {
      font-size: 14px;
      color: #2f2c2c;
    }

    .edit {
      display: none;
      position: absolute;
      top: -10px;
      right: -10px;
    }
  }
}
</style>
