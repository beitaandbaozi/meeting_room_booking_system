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
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // todo 注入 JwtService
  @Inject(JwtService)
  private jwtService: JwtService;

  // todo 注入Config服务
  @Inject(ConfigService)
  private configService: ConfigService;

  // todo 注入邮件服务
  @Inject(EmailService)
  private emailService: EmailService;

  // todo 注入redis服务
  @Inject(RedisService)
  private redisService: RedisService;

  // todo 注册
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }
  // todo 发送邮件
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<h1>验证码：${code}</h1>`,
    });
    return '发送邮箱验证码成功';
  }

  // todo 初始化数据（test鉴权）
  @Get('init-data')
  async initData() {
    this.userService.initData();
  }

  // todo 普通用户登录
  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    // todo accessToken
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_TIME') || '30m',
      },
    );
    // todo refreshToken
    vo.refreshToken = this.jwtService.sign(
      { userId: vo.userInfo.id },
      {
        expiresIn:
          this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_TIME') || '7d',
      },
    );
    return vo;
  }
  // todo 管理员登录
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    // todo accessToken
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_TIME') || '30m',
      },
    );
    // todo refreshToken
    vo.refreshToken = this.jwtService.sign(
      { userId: vo.userInfo.id },
      {
        expiresIn:
          this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_TIME') || '7d',
      },
    );
    return vo;
  }
  // todo 刷新token
  async refreshToken(refreshToken: string, isAdmin: boolean) {
    const data = this.jwtService.verify(refreshToken);
    const user = await this.userService.findUserById(data.userId, isAdmin);
    const access_token = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      },
      {
        expiresIn:
          this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_TIME') || '30m',
      },
    );
    const refresh_token = this.jwtService.sign(
      { userId: user.id },
      {
        expiresIn:
          this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_TIME') || '7d',
      },
    );
    return { access_token, refresh_token };
  }
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const { access_token, refresh_token } = await this.refreshToken(
        refreshToken,
        false,
      );
      return { access_token, refresh_token };
    } catch (error) {
      throw new UnauthorizedException('token 已经失效，请重新登录');
    }
  }
  // todo 刷新后台管理token
  @Get('admin/refresh')
  async refreshAdmin(@Query('refreshToken') refreshToken: string) {
    try {
      const { access_token, refresh_token } = await this.refreshToken(
        refreshToken,
        true,
      );
      return { access_token, refresh_token };
    } catch (error) {
      throw new UnauthorizedException('token 已经失效，请重新登录');
    }
  }
  // todo 获取用户信息
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);
    const userInfoVo = new UserDetailVo();
    userInfoVo.id = user.id;
    userInfoVo.username = user.username;
    userInfoVo.nickName = user.nickName;
    userInfoVo.email = user.email;
    userInfoVo.headPic = user.headPic;
    userInfoVo.phoneNumber = user.phoneNumber;
    userInfoVo.isFrozen = user.isFrozen;
    userInfoVo.createTime = user.createTime;

    return userInfoVo;
  }

  // todo 修改密码
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }
}
