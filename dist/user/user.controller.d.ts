import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    private jwtService;
    private configService;
    private emailService;
    private redisService;
    register(registerUser: RegisterUserDto): Promise<"register success" | "register fail">;
    captcha(address: string): Promise<string>;
    initData(): Promise<void>;
    login(loginUser: LoginUserDto): Promise<import("./vo/login-user.vo").LoginUserVo>;
    adminLogin(loginUser: LoginUserDto): Promise<import("./vo/login-user.vo").LoginUserVo>;
    refreshToken(refreshToken: string, isAdmin: boolean): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshAdmin(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    info(userId: number): Promise<UserDetailVo>;
    updatePassword(userId: number, passwordDto: UpdateUserPasswordDto): Promise<"修改密码成功！😆" | "修改密码失败！😭">;
    getUpdatePasswordCaptcha(address: string): Promise<string>;
}
