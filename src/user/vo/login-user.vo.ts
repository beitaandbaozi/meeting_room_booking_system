import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty()
  id: number;
  @ApiProperty({ example: 'zhangsan' })
  username: string;
  @ApiProperty({ example: '张三' })
  nickName: string;
  @ApiProperty({ example: 'xxx@xx.com' })
  email: string;
  @ApiProperty({ example: 'xxx.png' })
  headPic: string;
  @ApiProperty({ example: '13022007890' })
  phoneNumber: string;
  @ApiProperty()
  isFrozen: boolean;
  @ApiProperty()
  isAdmin: boolean;
  @ApiProperty()
  createTime: Date;
  @ApiProperty({ example: ['管理员'] })
  roles: string[];
  @ApiProperty({ example: ['query_aa'] })
  permissions: string[];
}
export class LoginUserVo {
  // 用户信息
  @ApiProperty()
  userInfo: UserInfo;
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
