<script setup lang="ts">
import { getRole, addRole, RoleResult } from "@/api/role";
import { onMounted, reactive, ref, watch } from "vue";
import { message } from "@/utils/message";
import { useColumns } from "../../config/role/table";
import DialogForm from "@/components/Customise/Role/form.vue";

defineOptions({
  name: "RoleManagement"
});
const {
  loading,
  columns,
  display,
  displayTarget,
  pagination,
  rowData,
  loadingConfig,
  adaptiveConfig,
  deleteId,
  onSizeChange,
  onCurrentChange
} = useColumns();
const data = ref([]);

async function roleList() {
  await getRole().then(result => {
    let res = (result as RoleResult).data;
    data.value = [...res];
  });
  console.log(data);
}

function messageBox(success: boolean, msg: string) {
  message(msg, {
    customClass: "el",
    type: success ? "success" : "error"
  });
  roleList();
}
onMounted(() => {
  roleList();
});
</script>

<template>
  <div class="w-full h-full none-margin">
    <div class="p-3 h-full w-full">
      <pure-table
        ref="tableRef"
        style="border-radius: 8px"
        border
        adaptive
        :adaptiveConfig="adaptiveConfig"
        row-key="role_id"
        alignWhole="center"
        showOverflowTooltip
        :loading="loading"
        :loading-config="loadingConfig"
        :data="
          data.slice(
            (pagination.currentPage - 1) * pagination.pageSize,
            pagination.currentPage * pagination.pageSize
          )
        "
        :columns="columns"
        :pagination="pagination"
        @page-size-change="onSizeChange"
        @page-current-change="onCurrentChange"
      />
      <DialogForm
        v-if="display"
        :display="display"
        :rows="rowData"
        @target="displayTarget"
        @msg="messageBox"
      />
    </div>
  </div>
</template>
<style>
.cell {
  text-align: center;
}
.row {
  height: 55px;
}
.container {
  width: 100%;
  height: 100%;
  background: #000;
}
.none-margin {
  margin: 0 !important;
}
</style>
