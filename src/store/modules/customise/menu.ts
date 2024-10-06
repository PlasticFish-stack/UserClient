import {
  addMenu,
  deleteMenu,
  getMenu,
  updateMenu,
  type Menu,
  type MenuResult
} from "@/api/menu";
import { defineStore } from "pinia";
import { ref } from "vue";
import { message } from "@/utils/message";
export const useMenuTableStore = defineStore("menu", () => {
  const setting = ref({
    options: "edit",
    type: "add",
    display: false,
    isParent: false
  });
  const loading = ref(false);
  const rowData = ref<Menu>(null);
  const optionLoading = ref(false);
  const dataList = ref([]);
  const data = ref([]);
  function isParent(bool: boolean) {
    setting.value.isParent = bool;
  }
  function rowDataInsert(row) {
    rowData.value = null;
    rowData.value = row;
  }
  function typeChange(t: string) {
    if (t == "add") {
      setting.value.type = "add";
    } else if (t == "edit") {
      setting.value.type = "edit";
    } else {
      return;
    }
  }
  async function menuList() {
    await getMenu().then(result => {
      let res = (result as MenuResult).data;
      console.log(res, "res");
      data.value = [...res];
    });
    console.log(data);
  }
  function displayTarget(displayBool?: boolean) {
    if (displayBool) {
      setting.value.display = displayBool;
    } else {
      setting.value.display = !setting.value.display;
    }
  }
  function loadingTarget(bool: boolean) {
    loading.value = bool;
  }
  function messageBox(success: boolean, msg: string) {
    message(msg, {
      customClass: "el",
      type: success ? "success" : "error"
    });
    menuList();
  }
  async function DeleteMenu(id: number) {
    optionLoading.value = true;
    try {
      await deleteMenu({
        id: id
      });
      messageBox(true, "删除菜单成功");
    } catch (error) {
      console.log(error);
      messageBox(false, "删除菜单失败");
    } finally {
      optionLoading.value = false;
    }
  }
  async function UpdateMenu(menus) {
    try {
      await updateMenu(menus);
      messageBox(true, "更新菜单成功");
    } catch (error) {
      console.log(error);
      messageBox(false, "更新菜单失败");
    }
  }
  async function AddMenu(menus) {
    try {
      await addMenu(menus);
      messageBox(true, "新增菜单成功");
    } catch (error) {
      console.log(error);
      messageBox(false, "新增菜单失败");
    }
  }
  return {
    setting,
    loading,
    loadingTarget,
    rowData,
    typeChange,
    dataList,
    displayTarget,
    rowDataInsert,
    DeleteMenu,
    UpdateMenu,
    optionLoading,
    isParent,
    AddMenu,
    menuList,
    data,
    messageBox
  };
});
