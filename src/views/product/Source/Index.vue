<script setup lang="ts">
import { getExport } from "@/api/source";
import { UploadFilled } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import ExportDialog from "./components/ExportDialog.vue";

const exportRef = ref(null);

const handleOpen = () => {
  exportRef.value.open();
};

onMounted(async () => {
  /* const res = await getExport({
    currencyName: "CNY",
    productTypeId: 3,
    productBrandId: 3
  }); */
});
</script>

<template>
  <div class="main">
    <el-button @click="handleOpen">打开弹窗表单</el-button>
    <el-upload
      class="upload-demo"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
    <ExportDialog ref="exportRef" />
  </div>
</template>

<style lang="scss" scoped></style>
