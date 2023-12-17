import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { md5 } from 'src/utils';

@Injectable()
export class UserService {
  // todo 日志
  private logger = new Logger();
  // todo 注入用户表对象
  @InjectRepository(User)
  private userRepository: Repository<User>;
  // todo 注入redis模块
  @Inject(RedisService)
  private redisService: RedisService;

  // todo 注册
  async register(userData: RegisterUserDto) {
    // 1. 按照email查询redis中的验证码
    // 1.1 没查到，说明验证码已经失效
    // 1.2 验证码不一致，说明输入错误
    const captcha = await this.redisService.get(`captcha_${userData.email}`);
    if (!captcha) throw new HttpException('验证码失效', HttpStatus.BAD_REQUEST);
    if (userData.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
    // 2. 按照 username 查询用户表
    // 2.1 找到了，说明用户已经存在
    // 2.2 没有，直接插入数据
    const foundUser = await this.userRepository.findOneBy({
      username: userData.username,
    });
    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = new User();
    newUser.username = userData.username;
    newUser.password = md5(userData.password);
    newUser.email = userData.email;
    newUser.nickName = userData.nickName;
    try {
      await this.userRepository.save(newUser);
      return 'register success';
    } catch (error) {
      this.logger.error(error, UserService);
      return 'register fail';
    }
  }
}
