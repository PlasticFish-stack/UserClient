export type User = {
  /** 用户Id */
  id: number;
  /** 头像 */
  avatar: string;
  /** 用户名 */
  name: string;
  /** 昵称 */
  nickname: string;
  /** 上次登录Ip */
  lastLoginIp?: string;
  /** 上次登录时间 */
  lastLoginTime?: Date;
  /** 密码 */
  password: string;
  /** 使用状态 */
  status: boolean;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
};

export type UserData = User[];

export interface UserStoreState {
  userData: UserData;
  userDialog: boolean;
  loading: boolean;
  rowData: User;
  type: boolean;
  optionLoading: boolean;
}

export interface UserStoreReturn {
  state: UserStoreState;
  getUserPage: () => void;
  addUserForm: () => void;
  displayTarget: (displayBool?: boolean) => void;
  rowDataInsert: (row: User) => void;
  typeChange: (t: "add" | "edit") => void;
  DeleteRole: (data: { id: User["id"]; name: User["name"] }) => void;
  userRoleDialogRef: any;
  loadingTarget: (bool?: boolean) => void;
  userRoleDiaRef: (container: any) => void;
}
