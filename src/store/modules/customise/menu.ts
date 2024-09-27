import {
  addChildMenu,
  addParentMenu,
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
  const display = ref(false);
  const addParent = ref(true);
  const loading = ref(false);
  const rowData = ref<Menu>(null);
  const type = ref(true);
  const optionLoading = ref(false);
  const dataList = ref([]);
  const data = ref([]);
  function isParent(bool: boolean) {
    addParent.value = bool;
  }
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
    menuList();
  }
  async function DeleteMenu(id: number) {
    optionLoading.value = true;
    try {
      await deleteMenu({
        menu_id: id
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
  async function AddMenu(menus, bool) {
    try {
      if (bool) {
        await addParentMenu(menus);
      } else {
        await addChildMenu(menus);
      }

      messageBox(true, "新增菜单成功");
    } catch (error) {
      console.log(error);
      messageBox(false, "新增菜单失败");
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
    DeleteMenu,
    UpdateMenu,
    optionLoading,
    isParent,
    AddMenu,
    addParent,
    menuList,
    data,
    messageBox
  };
});
