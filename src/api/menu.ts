import { http } from "@/utils/http";
export type Menu = {
  /** id */
  id?: number;
  /** 角色名 */
  name: string;
  description: string;
  /** 角色简介 */
  identifier?: string;
  path: string;
  /** 角色状态 */
  status: boolean;
  /** 创建时间 */
  create_time: Date;
  /** 修改时间 */
  update_time: Date;
  /** 角色标识 */
  icon: string;
  component: string;
  sort: number;
  parent_id: number;
};
export type MenuResult = {
  success: boolean;
  data: [Menu];
};

/** 获取角色列表 */
export const getMenu = (data?: object) => {
  return http.request<MenuResult>("get", "/menu/getall", { data });
};
export const addMenu = (data?: object) => {
  return http.request<MenuResult>(
    "post",
    "/menu/add",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};
export const updateMenu = (data?: object) => {
  return http.request<MenuResult>(
    "post",
    "/updatemenus",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};
export const deleteMenu = (data?: object) => {
  return http.request<MenuResult>(
    "post",
    "/deletemenus",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};
