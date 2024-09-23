<script setup lang="ts">
import { getRole, addRole, RoleResult } from "@/api/role";
import { formatGolangDate } from "@/utils/time/date";
import { onMounted, reactive } from "vue";
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

const handleEdit = (index: number, row: RoleResult) => {
  console.log(index, row);
};
const handleDelete = (index: number, row: RoleResult) => {
  console.log(index, row);
};
onMounted(() => {
  roleList();
});
</script>

<template>
  <div class="w-full h-full none-margin">
    <div class="p-3 h-full w-full">
      <el-table
        :data="data"
        style="border-radius: 4px; height: 100%"
        stripe
        row-class-name="row"
        cell-class-name="cell"
        row-key="role_id"
      >
        <el-table-column prop="role_id" label="角色Id" />
        <el-table-column prop="role_name" label="角色名" />
        <el-table-column prop="role_desc" label="角色简介" />
        <el-table-column prop="role_identifier" label="角色标识" />
        <el-table-column prop="status" label="状态">
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
        <el-table-column label="操作选项">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
