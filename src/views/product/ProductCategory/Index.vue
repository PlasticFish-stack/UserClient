<script setup lang="ts">
import { defineComponent, onMounted } from "vue";
import { useProductCategoryStore } from "./modules/store";

defineComponent({
  name: "ProductCategory"
});
const categoryStore = useProductCategoryStore();

onMounted(() => {
  categoryStore.initCategory();
});
</script>

<template>
  <div>产品类别</div>
</template>

<style lang="scss" scoped></style>
