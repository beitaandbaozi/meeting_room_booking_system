interface UserInfo {
  id: number;
  username: string;
  nickName: string;
  email: string;
  headPic: string;
  phoneNumber: string;
  isFrozen: boolean;
  isAdmin: boolean;
  createTime: Date;
  roles: string[];
  permissions: string[];
}
export class LoginUserVo {
  // 用户信息
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}
