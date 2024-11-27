<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import {
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile
} from "element-plus";
import { importFile, upFile } from "@/api/source";
import { FileType } from "../modules/types";
import { errorMes, successMes } from "@/utils/globalReqMes";
import { PaginationProps } from "@pureadmin/table";
import { cloneDeep } from "@pureadmin/utils";
import { recursionAryData, resetReactiveState } from "@/utils/globalUtils";
import useColumns from "../modules/importConfig";
import { PlusForm } from "plus-pro-components";

const defaultState = {
  visible: false,
  active: 1,
  loading: false,
  subFileSText: "",
  upFileData: null,
  toBeSubData: []
};

const { columns: subFormColumns, rules } = useColumns();

const state = reactive(cloneDeep(defaultState));
const baseInfo = reactive({
  currencyName: "",
  productBrandName: "",
  productTypeName: ""
});

const pagination = reactive<PaginationProps>({
  pageSize: 20,
  currentPage: 1,
  pageSizes: [20, 40, 60],
  total: 1,
  align: "center",
  background: true,
  size: "default"
});

const formRef = ref(null);

const columns = ref<TableColumnList>([]);
const files = ref<UploadUserFile[]>([]);
const form = ref({
  fileName: "",
  description: ""
});

const data = computed(() => {
  return state.toBeSubData.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );
});

const dataMapping = computed(() => {
  const copyData = cloneDeep(data.value);

  const integrationMapping = recursionAryData(copyData);
  return integrationMapping;
});

// 检查是否为excel文件
const containsXlsx = str => {
  const regex = /.xlsx$/i;
  return regex.test(str);
};

const handleProgress = (file: UploadRawFile) => {
  if (containsXlsx(file.name) && file.type === FileType.XLSX) {
    state.subFileSText = "";
    files.value = [file];
    form.value.fileName = file.name;
    return true;
  } else {
    state.subFileSText = "请校验上传的文件是否为XLSX文件！！！";
    return false;
  }
};

const handleColumnsHide = prop => {
  const columnsData = dataMapping.value[prop];
  return Array.isArray(columnsData) && columnsData.length > 0 ? false : true;
};

const integrationCol = (key, isOpt = false) => {
  const prop = isOpt ? `options-${key}` : key;
  return {
    label: isOpt ? `字段（${key}）` : key,
    prop,
    width: "150px",
    showOverflowTooltip: true,
    hide: () => {
      return handleColumnsHide(prop);
    }
  };
};

const integrationOptions = options => {
  return Object.keys(options).map(key => {
    return integrationCol(key, true);
  });
};

const integrationData = data => {
  return data.map(item => {
    const os = {};
    if (item.Options) {
      Object.keys(item.Options).forEach(i => {
        os[`options-${i}`] = item.Options[i];
      });
    }
    return {
      ...item,
      ...os
    };
  });
};

const integrationBaseInfo = configParam => {
  const { currencyName, productBrandName, productTypeName, rate } = configParam;

  baseInfo.currencyName = `${currencyName}-${rate}`;
  baseInfo.productBrandName = productBrandName;
  baseInfo.productTypeName = productTypeName;
};

const handleImport = (options: UploadRequestOptions) => {
  state.loading = true;
  const file = new FormData();
  file.append("file", options.file);
  return upFile(file)
    .then(res => {
      state.upFileData = res.data;
      state.toBeSubData = integrationData(res.data.excelData);

      integrationBaseInfo(res.data.configParam);

      pagination.total = state.toBeSubData.length;

      let demo = res.data.excelData[0];
      if (demo) {
        const integrationColumns = Object.keys(demo).reduce((pre, key) => {
          if (key === "options") {
            pre = pre.concat(integrationOptions(demo["options"]));
          } else if (
            !["typeId", "typeName", "brandId", "brandName"].includes(key)
          ) {
            pre = pre.concat(integrationCol(key));
          }
          return pre;
        }, []);
        columns.value = integrationColumns;
      }
    })
    .catch(err => {
      state.subFileSText = "请求失败";
      files.value = [];
      errorMes(err?.response?.statusText);
    })
    .finally(() => {
      state.loading = false;
    });
};

const onSizeChange = val => {
  pagination.pageSize = val;
};

const onCurrentChange = page => {
  pagination.currentPage = page;
};

const handleCalcel = () => {
  resetReactiveState(state, defaultState);
  state.visible = false;
};

const open = () => {
  state.visible = true;
};

const subFile = async () => {
  const res = await importFile({
    ...state.upFileData,
    ...form.value
  });
  if (res.success) {
    successMes("导入成功！");
    handleCalcel();
  }
};

const handleActiveChange = (key: "up" | "down" | "submit") => {
  let upActive = state.active;
  switch (key) {
    case "up": {
      state.active = state.active - 1;
      break;
    }
    case "down": {
      if (upActive === 2) {
        state.active = state.active + 1;
      } else {
        if (files.value.length === 0) {
          state.subFileSText = "请先上传文件！";
        } else if (files.value.length > 0 && !state.subFileSText) {
          state.active = state.active + 1;
        } else {
          state.subFileSText = "请校验上传的文件是否为XLSX文件！！！";
        }
      }

      break;
    }
    case "submit": {
      const formInstance = formRef.value?.formInstance;
      formInstance.validate(valid => {
        if (valid) {
          subFile();
        }
      });
      break;
    }
    default:
      break;
  }
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog
    v-model="state.visible"
    title="导入成本价表"
    width="900"
    @close="handleCalcel"
  >
    <div class="flex items-center" style="flex-direction: column">
      <el-steps class="w-[600px]" :active="state.active" align-center>
        <el-step title="导入文件" />
        <el-step title="确认内容" />
        <el-step title="提交" />
      </el-steps>

      <div class="w-[100%] overflow-hidden">
        <div v-if="state.active === 1">
          <el-upload
            drag
            multiple
            :file-list="files"
            :http-request="handleImport"
            :before-upload="handleProgress"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">上传成本价表</div>
          </el-upload>
          <div style="color: red; font-size: 12px">
            {{ state.subFileSText }}
          </div>
        </div>

        <div v-if="state.active === 2">
          <div
            class="flex items-center justify-between gap-[8px] m-4"
            style="font-size: 16px"
          >
            <div>类型：{{ baseInfo.productTypeName }}</div>
            <div>品牌：{{ baseInfo.productBrandName }}</div>
            <div>货币汇率：{{ baseInfo.currencyName }}</div>
          </div>
          <pure-table
            border
            stripe
            maxHeight="500"
            :data="data"
            :columns="columns"
            :pagination="pagination"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
          />
        </div>

        <div v-if="state.active === 3">
          <PlusForm
            ref="formRef"
            v-model="form"
            :columns="subFormColumns"
            :rules="rules"
            :hasFooter="false"
          />
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
          v-if="state.active === 1 || state.active === 2"
          :loading="state.loading"
          @click="() => handleActiveChange('down')"
          >下一步</el-button
        >
        <el-button
          v-if="state.active === 3"
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
