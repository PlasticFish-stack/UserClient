import { http } from "@/utils/http";
export type Role = {
  /** id */
  id?: number;
  /** 角色名 */
  name: string;
  /** 角色简介 */
  description?: string;
  /** 角色状态 */
  status: boolean;
  /** 创建时间 */
  createTime: Date;
  /** 修改时间 */
  updateTime: Date;
  /** 角色标识 */
  identifier: string;
};
export type RoleResult = {
  success: boolean;
  data: [Role];
};

/** 获取角色列表 */
export const getRole = (data?: object) => {
  return http.request<RoleResult>("get", "/role/get-all", { data });
};
export const addRole = (data?: object) => {
  return http.request<RoleResult>("post", "/role/add", { data });
};
export const updateRole = (data?: object) => {
  return http.request<RoleResult>("post", "/role/update", { data });
};
export const deleteRole = (data?: object) => {
  return http.request<RoleResult>("post", "/role/delete", { data });
};

export const updateRoleMenu = (data?: object) => {
  return http.request<RoleResult>("post", "/role/bind-menu", { data });
};

export const updateRoleApiField = (data?: object) => {
  return http.request<RoleResult>("post", "/role/bind-api-field", { data });
};

export const getBindMenu = (data?: object) => {
  return http.request<RoleResult>("get", "/role/get-bind-menu", {
    params: data
  });
};

export const getBindApiField = (data?: object) => {
  return http.request<RoleResult>("get", "/role/get-bind-api-field", {
    params: data
  });
};
