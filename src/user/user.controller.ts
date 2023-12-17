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
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
