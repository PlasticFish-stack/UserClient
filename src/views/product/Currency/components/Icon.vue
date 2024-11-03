<template>
  <!-- <component :is="svgComponent" v-if="svgComponent" /> -->
  <!-- <CN class="CN" /> -->
  <span :class="['fi', `fi-${icon}`, 'fib']" />
  <!-- <span class="fi fi-gr fis"></span> -->
</template>

<script setup>
import { computed, ref, watch } from "vue";
// import CN from "@/assets/flags/4x3/cn.svg?component";

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

// const svgComponent = ref(null);
const icon = computed(() => props.name || "xx");

/* async function loadSvg() {
  try {
    // 动态导入SVG组件
    // if (!props.name) return;
    const icon = props.name || "xx";
    svgComponent.value = await import(
      `@/assets/flags/4x3/${icon}.svg?component`
    );
  } catch (error) {
    console.error(`Error loading SVG: ${props.name}`, error);
    // 处理错误，例如设置一个默认的SVG或者显示错误信息
    svgComponent.value = null;
  }
}

// 当组件被挂载后，加载SVG
loadSvg(); */
</script>

<style lang="scss" scoped>
svg {
  width: 100px;
  height: 70px;
}

.fi {
  width: 100px !important;
  height: 70px !important;
}
</style>
