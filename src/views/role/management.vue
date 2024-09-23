<script setup lang="ts">
import { getRole, RoleResult } from "@/api/role";
import { formatGolangDate } from "@/utils/time/date";
import { onMounted, reactive, ref } from "vue";
defineOptions({
  name: "RoleManagement"
});
const data = reactive([]);
async function roleList() {
  await getRole().then(result => {
    let res = (result as RoleResult).data;
    data.push(...res);
  });
  console.log(data);
}
onMounted(() => {
  roleList();
});
</script>

<template>
  <div class="h-full p-4">
    <el-table :data="data" stripe cell-class-name="cell" row-key="role_id">
      <el-table-column prop="role_id" label="角色Id" width="100" />
      <el-table-column prop="role_name" label="角色名" width="150" />
      <el-table-column prop="role_desc" label="角色简介" width="250" />
      <el-table-column prop="role_identifier" label="角色标识" width="180" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.status ? 'success' : 'danger'">{{
            scope.row.status ? "生效" : "失效"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="200">
        <template #default="scope">
          {{ formatGolangDate(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="200">
        <template #default="scope">
          {{ formatGolangDate(scope.row.update_time) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style>
.cell {
  text-align: center;
}

.container {
  width: 100%;
  height: 100%;
  background: #000;
}
</style>
