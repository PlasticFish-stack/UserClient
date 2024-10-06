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
  create_time: Date;
  /** 修改时间 */
  update_time: Date;
  /** 角色标识 */
  identifier: string;
};
export type RoleResult = {
  success: boolean;
  data: [Role];
};

/** 获取角色列表 */
export const getRole = (data?: object) => {
  return http.request<RoleResult>("get", "/role/getall", { data });
};
export const addRole = (data?: object) => {
  return http.request<RoleResult>(
    "post",
    "/role/add",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};
export const updateRole = (data?: object) => {
  return http.request<RoleResult>(
    "post",
    "/role/update",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};
export const deleteRole = (data?: object) => {
  return http.request<RoleResult>(
    "post",
    "/role/delete",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};
