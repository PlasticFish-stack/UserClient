import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { VNode, VueElement } from "vue";
import type { UserStoreState, UserStoreReturn, User } from "./types";
import { deleteUser, getUser } from "@/api/user";
import { errorMes, successMes } from "@/utils/globalReqMes";

export const useUserTableStore = defineStore("user", (): UserStoreReturn => {
  const state = reactive<UserStoreState>({
    userData: [],
    userDialog: false,
    loading: false,
    rowData: null,
    type: false,
    optionLoading: false
  });

  const roleMenuDialogRef = ref<VueElement | VNode | JSX.Element>(null);

  const getUserPage = async () => {
    const res = await getUser();

    if (res.success) {
      state.userData = res.data;
    }
  };

  const addUserForm = () => {
    state.userDialog = true;
  };

  const displayTarget = (displayBool?: boolean) => {
    if (displayBool) {
      state.userDialog = displayBool;
    } else {
      state.userDialog = !state.userDialog;
    }
  };

  const rowDataInsert = (row: User) => {
    state.rowData = null;
    state.rowData = row;
  };

  const typeChange = (t: "add" | "edit") => {
    if (t == "add") {
      state.type = false;
    } else {
      state.type = true;
    }
  };

  const DeleteRole = async (data: { id: User["id"]; name: User["name"] }) => {
    state.optionLoading = true;
    try {
      await deleteUser(data);
      successMes("删除用户成功");
    } catch (error) {
      console.log(error);
      errorMes("删除用户失败");
    } finally {
      state.optionLoading = false;
    }
  };

  const loadingTarget = (bool: boolean) => {
    state.loading = bool;
  };

  return {
    state,
    getUserPage,
    addUserForm,
    displayTarget,
    rowDataInsert,
    typeChange,
    DeleteRole,
    roleMenuDialogRef,
    loadingTarget
  };
});
