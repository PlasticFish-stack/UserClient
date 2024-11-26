<script setup lang="ts">
import { reactive } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import {
  UploadFile,
  UploadProgressEvent,
  UploadRequestOptions
} from "element-plus";
import { upFile } from "@/api/source";

const state = reactive({
  visible: false,
  active: 1
});

const handleActiveChange = (key: "up" | "down" | "submit") => {
  switch (key) {
    case "up": {
      state.active = state.active - 1;
      break;
    }
    case "down": {
      state.active = state.active + 1;
      break;
    }
    case "submit": {
      state.active = state.active + 1;
      break;
    }
    default:
      break;
  }
};

const handleProgress = (evt: UploadProgressEvent, uploadFile: UploadFile) => {
  /* console.log("=============", {
    evt,
    uploadFile
  }); */
};

const handleImport = (options: UploadRequestOptions) => {
  const file = new FormData();
  file.append("file", options.file);
  console.log("=============", {
    options,
    file
  });
  return upFile(file).then(res => {
    console.log("=============", res);
  });
};

const handleCalcel = () => {
  state.visible = false;
};

const open = () => {
  state.visible = true;
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog
    v-model="state.visible"
    title="导入成本价表"
    width="800"
    @close="handleCalcel"
  >
    <div class="flex items-center" style="flex-direction: column">
      <el-steps class="w-[600px]" :active="state.active" align-center>
        <el-step title="导入文件" />
        <el-step title="确认内容" />
        <el-step title="提交" />
      </el-steps>

      <div class="w-[100%] h-[500px] overflow-hidden">
        <div v-if="state.active === 0 || state.active === 1">
          <el-upload
            class="upload-demo"
            :http-request="handleImport"
            drag
            multiple
            :on-progress="handleProgress"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">上传成本价表</div>
          </el-upload>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center gap-[8px] justify-end">
        <el-button
          v-if="state.active === 2 || state.active === 3"
          @click="() => handleActiveChange('up')"
        >
          上一步
        </el-button>
        <el-button
          v-if="state.active !== 3"
          @click="() => handleActiveChange('down')"
          >下一步</el-button
        >
        <el-button
          v-if="state.active === 2 || state.active === 3"
          type="primary"
          @click="() => handleActiveChange('submit')"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
