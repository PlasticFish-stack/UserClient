<script setup lang="ts">
import type { CurrencyTypes } from "@/api/currency";
import { PlusCheckCard } from "plus-pro-components";
import Icon from "@/views/product/Currency/components/Icon.vue";

interface Props {
  data: CurrencyTypes[];
}

const props = withDefaults(defineProps<Props>(), {
  data: () => []
});
</script>

<template>
  <PlusCheckCard v-for="i in props.data" :key="i.id">
    <template #avatar>
      <div class="svg-container">
        <Icon :name="i.countryIcon" />
      </div>
    </template>
    <template #title>
      <div class="flex direction-column items-center justify-between w-[100%]">
        <div>
          <h3>{{ i.currencyName }}</h3>
          <h4>{{ i.descriptionCn || "-" }}</h4>
        </div>
        <div class="h-[100%]">
          <h2>{{ i.cost }}</h2>
        </div>
      </div>
    </template>
  </PlusCheckCard>
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
