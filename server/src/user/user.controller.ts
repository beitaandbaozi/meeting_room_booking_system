import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // todo 注入 jwt 对象
  @Inject(JwtService)
  private jwtService: JwtService;

  // todo 注入 config
  @Inject(ConfigService)
  private configService: ConfigService;

  // todo 注册用户
  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  // todo 发送邮件
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    return this.userService.captcha(address);
  }

  // todo 初始化数据（测试）
  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  // todo 普通用户登录
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );
    return vo;
  }
  // todo 管理员登录
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );
    return vo;
  }

  // todo token刷新
  async _toRefresh(refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, false);
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );
      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expires_time') || '7d',
        },
      );
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    const { access_token, refresh_token } = await this._toRefresh(refreshToken);
    return { access_token, refresh_token };
  }
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    const { access_token, refresh_token } = await this._toRefresh(refreshToken);
    return { access_token, refresh_token };
  }

  // todo 查询用户信息
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isFrozen = user.isFrozen;
    return vo;
  }

  // todo 修改密码
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    console.log(passwordDto);
    return 'success';
  }
  // todo 修改密码邮箱发送
  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    return await this.userService.updatePasswordCaptcha(address);
  }
  // todo 修改个人信息
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async updateUserInfo(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUserInfo(userId, updateUserDto);
  }
  // todo 修改个人信息邮箱发送
  @Get('update/captcha')
  async updateCaptcha(@Query('address') address: string) {
    return await this.userService.updateCaptcha(address);
  }
}
