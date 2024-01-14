import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { md5 } from 'src/utils';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  // todo 注入日志对象
  private logger = new Logger();
  // todo 注入 User表
  @InjectRepository(User)
  private userRepository: Repository<User>;
  // todo 注入redis对象
  @Inject(RedisService)
  private redisService: RedisService;
  // todo 注入email对象
  @Inject(EmailService)
  private emailService: EmailService;

  // todo 注册
  async register(user: RegisterUserDto) {
    // 1. redis 检查是否有发送过验证码
    // 1.1 没有，说明已经失效
    // 1.2 与发送过来的进行比较
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    // 2. 查询用户表
    // 2.1 用户存在，返回提示
    // 2.2 用户不存在，存入数据库
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }
  // todo 注册邮件发送
  async captcha(address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }
}
