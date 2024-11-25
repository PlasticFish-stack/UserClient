import { http } from "@/utils/http";
import type { UserData } from "@/views/system/UserPage/CoreModules/types";

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

interface UserPageResult {
  success: boolean;
  data: UserData;
}

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login", { data });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh", { data });
};

export const getUser = () => {
  return http.request<UserPageResult>("get", "/user/getall");
};

export const deleteUser = (data?: object) => {
  return http.request<UserPageResult>("post", "/user/delete", { data });
};

export const updateUserRole = (data?: object) => {
  return http.request<UserResult>("post", "/user/bind", { data });
};

export const getBindRole = (data?: object) => {
  return http.request<UserPageResult>("get", "/user/getbind", { params: data });
};
export const updateUser = (data?: object) => {
  return http.request<UserResult>("post", "/user/update", { data });
};
export const registerUser = (data?: object) => {
  return http.request<UserResult>("post", "/user/add", { data });
};
