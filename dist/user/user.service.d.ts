import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private logger;
    private userRepository;
    private redisService;
    private roleRepository;
    private permissionRepository;
    private emailService;
    initData(): Promise<void>;
    register(userData: RegisterUserDto): Promise<"register success" | "register fail">;
    login(loginUser: LoginUserDto, isAdmin: boolean): Promise<LoginUserVo>;
    findUserById(userId: number, isAdmin: boolean): Promise<{
        id: number;
        username: string;
        isAdmin: boolean;
        roles: string[];
        permissions: any[];
    }>;
    findUserDetailById(userId: number): Promise<User>;
    updatePassword(userId: number, passwordDto: UpdateUserPasswordDto): Promise<"修改密码成功！😆" | "修改密码失败！😭">;
    getUpdatePasswordCaptcha(address: string): Promise<string>;
    updateUserInfo(userId: number, updateUserDto: UpdateUserDto): Promise<"修改成功！😊" | "修改失败！😢">;
    getUpdateUserCaptcha(address: string): Promise<string>;
}
