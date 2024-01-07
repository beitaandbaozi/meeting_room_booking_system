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
  ParseIntPipe,
  BadRequestException,
  DefaultValuePipe,
  HttpStatus,
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
import { UpdateUserDto } from './dto/update-user.dto';
import { validatePageType } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserListVo } from './vo/user-list.vo';
@ApiTags('用户管理')
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码失效/验证码错误/用户名已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }
  // todo 发送邮件
  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
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
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
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
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
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
    const vo = new RefreshTokenVo();
    vo.access_token = access_token;
    vo.refresh_token = refresh_token;
    return { access_token: vo.access_token, refresh_token: vo.refresh_token };
  }
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新token',
    required: true,
    example: 'xxxxxxxxyyyyyyyzzzzz',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '无效的token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新token成功',
    type: RefreshTokenVo,
  })
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
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新token',
    required: true,
    example: 'xxxxxxxxyyyyyyyzzzzz',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '无效的token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新token成功',
    type: RefreshTokenVo,
  })
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
  @ApiBearerAuth()
  @ApiQuery({
    name: 'userId',
    description: '用户编号',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取用户信息成功',
    type: UserDetailVo,
  })
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
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确',
    type: String,
  })
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  // todo 修改密码邮箱发送验证码
  @ApiQuery({
    name: 'address',
    description: '邮箱地址',
    required: true,
    type: String,
  })
  @ApiResponse({
    type: String,
    description: '发送成功',
  })
  @Get('update_password/captcha')
  @RequireLogin()
  async getUpdatePasswordCaptcha(@Query('address') address: string) {
    return await this.userService.getUpdatePasswordCaptcha(address);
  }

  // todo 修改个人信息
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String,
  })
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async updateUserInfo(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUserInfo(userId, updateUserDto);
  }

  // todo 修改个人信息发送验证码
  @Get('update/captcha')
  async getUpdateUserCaptcha(@Query('address') address: string) {
    return await this.userService.getUpdateUserCaptcha(address);
  }

  // todo 冻结用户
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    description: 'userId',
    type: Number,
  })
  @ApiResponse({
    type: String,
    description: 'success',
  })
  @Get('freeze')
  async freezeUser(@Query('id') userId: number) {
    await this.userService.freezeUser(userId);
    return 'freeze success';
  }

  // todo 获取用户列表
  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    type: Number,
  })
  @ApiQuery({
    name: 'username',
    description: '用户名',
    type: Number,
  })
  @ApiQuery({
    name: 'nickName',
    description: '昵称',
    type: Number,
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱地址',
    type: Number,
  })
  @ApiResponse({
    type: UserListVo,
    description: '用户列表',
  })
  @Get('list')
  @RequireLogin()
  async getUserList(
    @Query(
      'pageNumber',
      new DefaultValuePipe(1),
      validatePageType('pageNumber'),
    )
    pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10), validatePageType('pageSize'))
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.getUserList(
      pageNumber,
      pageSize,
      username,
      nickName,
      email,
    );
  }
}
