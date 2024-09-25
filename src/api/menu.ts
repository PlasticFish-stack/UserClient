import { http } from "@/utils/http";
export type Role = {
  /** id */
  menu_id?: number;
  /** 角色名 */
  menu_name: string;
  /** 角色简介 */
  menu_identifier?: string;
  menu_path: string;
  /** 角色状态 */
  status: boolean;
  /** 创建时间 */
  create_time: Date;
  /** 修改时间 */
  update_time: Date;
  /** 角色标识 */
  menu_icon: string;
  menu_component: string;
  menu_type: boolean;
  menu_sort: number;
  parent_id: number;
};
export type MenuResult = {
  success: boolean;
  data: [Role];
};

/** 获取角色列表 */
export const getMenu = (data?: object) => {
  return http.request<MenuResult>("get", "/getmenus", { data });
};
export const addRole = (data?: object) => {
  return http.request<MenuResult>(
    "post",
    "/addroles",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};
export const updateRole = (data?: object) => {
  return http.request<MenuResult>(
    "post",
    "/updateroles",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};
export const deleteRole = (data?: object) => {
  return http.request<MenuResult>(
    "post",
    "/deleteroles",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};
