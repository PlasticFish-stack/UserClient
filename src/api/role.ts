import { http } from "@/utils/http";
type Role = {
  /** id */
  roleid: number;
  /** 角色名 */
  rolename: string;
  /** 角色简介 */
  roledesciption: string;
  /** 角色状态 */
  status: boolean;
  /** 创建时间 */
  createTime: Date;
  /** 修改时间 */
  updateTime: Date;
  /** 角色标识 */
  roleIdentifier: string;
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
  return http.request<RoleResult>("post", "/addroles", { data });
};
