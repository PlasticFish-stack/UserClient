import { http } from "@/utils/http";
export type Role = {
  /** id */
  role_id?: number;
  /** 角色名 */
  role_name: string;
  /** 角色简介 */
  role_desc?: string;
  /** 角色状态 */
  status: boolean;
  /** 创建时间 */
  create_time: Date;
  /** 修改时间 */
  update_time: Date;
  /** 角色标识 */
  role_identifier: string;
};
export type RoleResult = {
  success: boolean;
  data: [Role];
};

/** 获取角色列表 */
export const getRole = (data?: object) => {
  return http.request<RoleResult>("get", "/getroles", { data });
};
export const addRole = (data?: object) => {
  return http.request<RoleResult>(
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
  return http.request<RoleResult>(
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
  return http.request<RoleResult>(
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
