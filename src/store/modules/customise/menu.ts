import {
  deleteRole,
  updateRole,
  getRole,
  addRole,
  type RoleResult,
  type Role
} from "@/api/role";
import { defineStore } from "pinia";
import { ref } from "vue";
import { message } from "@/utils/message";
export const useMenuTableStore = defineStore("menu", () => {
  const display = ref(false);
  const loading = ref(false);
  const rowData = ref<Role>(null);
  const type = ref(true);
  const optionLoading = ref(false);
  const dataList = ref([]);
  const data = ref([]);
  function rowDataInsert(row) {
    rowData.value = null;
    rowData.value = row;
  }
  function typeChange(t: string) {
    if (t == "add") {
      type.value = false;
    } else {
      type.value = true;
    }
  }
  async function roleList() {
    await getRole().then(result => {
      let res = (result as RoleResult).data;
      data.value = [...res];
    });
    console.log(data);
  }
  function displayTarget(displayBool?: boolean) {
    if (displayBool) {
      display.value = displayBool;
    } else {
      display.value = !display.value;
    }

    console.log(display.value);
  }
  function loadingTarget(bool: boolean) {
    loading.value = bool;
  }
  function messageBox(success: boolean, msg: string) {
    message(msg, {
      customClass: "el",
      type: success ? "success" : "error"
    });
    roleList();
  }
  async function DeleteRole(id: number) {
    optionLoading.value = true;
    try {
      await deleteRole({
        role_id: id
      });
      messageBox(true, "删除角色成功");
    } catch (error) {
      console.log(error);
      messageBox(false, "删除角色失败");
    } finally {
      optionLoading.value = false;
    }
  }
  async function UpdateRole(roles) {
    try {
      await updateRole(roles);
      messageBox(true, "更新角色成功");
    } catch (error) {
      console.log(error);
      messageBox(false, "更新角色失败");
    }
  }
  async function AddRole(roles) {
    try {
      await addRole(roles);
      messageBox(true, "新增角色成功");
    } catch (error) {
      console.log(error);
      messageBox(false, "新增角色失败");
    }
  }
  return {
    display,
    loading,
    loadingTarget,
    rowData,
    typeChange,
    dataList,
    type,
    displayTarget,
    rowDataInsert,
    DeleteRole,
    UpdateRole,
    optionLoading,
    AddRole,
    roleList,
    data,
    messageBox
  };
});
