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
  createTime: Date;
  /** 修改时间 */
  updateTime: Date;
  /** 角色标识 */
  icon: string;
  component: string;
  sort: number;
  parentId: number;
  children: Menu[];
};
export type MenuResult = {
  success: boolean;
  data: Menu[];
};

/** 获取角色列表 */
export const getMenu = (data?: object) => {
  return http.request<MenuResult>("get", "/menu/getall", { data });
};
export const addMenu = (data?: object) => {
  return http.request<MenuResult>("post", "/menu/add", { data });
};
export const updateMenu = (data?: object) => {
  return http.request<MenuResult>("post", "/menu/update", { data });
};
export const deleteMenu = (data?: object) => {
  return http.request<MenuResult>("post", "/menu/delete", { data });
};
