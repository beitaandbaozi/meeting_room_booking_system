import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { md5 } from 'src/utils';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';

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
  // todo 注入role表对象
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;
  // todo 注入permission对象
  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;
  // todo 测试数据
  async initData() {
    // admin 账号
    const user1 = new User();
    user1.username = 'admin';
    user1.password = md5('admin');
    user1.email = 'admin@qq.com';
    user1.isAdmin = true;
    user1.nickName = '管理员';
    user1.phoneNumber = '13800000000';

    // 普通用户账号
    const user2 = new User();
    user2.username = 'gai';
    user2.password = md5('gai');
    user2.email = 'gai@qq.com';
    user2.nickName = 'gai';
    user2.phoneNumber = '13800000001';

    // 角色
    const role1 = new Role();
    role1.name = '管理员';
    const role2 = new Role();
    role2.name = '普通用户';

    // 权限
    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问ccc窗口';
    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问ddd窗口';

    // 权限关联
    user1.roles = [role1];
    user2.roles = [role2];
    role1.permissions = [permission1, permission2];
    role2.permissions = [permission2];

    // 保存数据
    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }
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

  // todo 用户登录
  async login(loginUser: LoginUserDto, isAdmin: boolean) {
    // 1. 从数据库查询是否有该对象
    // 1.1 没有  退出
    // 1.2 有
    // 1.2.1 校验密码
    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username,
        isAdmin,
      },
      // 设置级联查询 roles 和 roles.permissions
      relations: ['roles', 'roles.permissions'],
    });
    console.log('user', user);
    if (!user) throw new HttpException('用户不存在！', HttpStatus.BAD_REQUEST);
    if (user.password !== md5(loginUser.password)) {
      throw new HttpException('密码错误！', HttpStatus.BAD_REQUEST);
    }
    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      headPic: user.headPic,
      phoneNumber: user.phoneNumber,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      createTime: user.createTime,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
    return vo;
  }

  // todo 通过id获取用户信息
  async findUserById(userId: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });
    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }
}
