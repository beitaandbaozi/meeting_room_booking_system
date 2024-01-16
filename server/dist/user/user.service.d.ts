import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
export declare class UserService {
    private logger;
    private userRepository;
    private roleRepository;
    private permissionRepository;
    private redisService;
    private emailService;
    register(user: RegisterUserDto): Promise<"注册成功" | "注册失败">;
    captcha(address: string): Promise<string>;
    initData(): Promise<void>;
    login(loginUserDto: LoginUserDto, isAdmin: boolean): Promise<LoginUserVo>;
    findUserById(userId: number, isAdmin: boolean): Promise<{
        id: number;
        username: string;
        isAdmin: boolean;
        roles: string[];
        permissions: any[];
    }>;
    findUserDetailById(userId: number): Promise<User>;
    updatePassword(userId: number, passwordDto: UpdateUserPasswordDto): Promise<"密码修改成功" | "密码修改失败">;
    updatePasswordCaptcha(address: string): Promise<string>;
}
