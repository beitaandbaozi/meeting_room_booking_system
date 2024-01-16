import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    private jwtService;
    private configService;
    register(registerUser: RegisterUserDto): Promise<"注册成功" | "注册失败">;
    captcha(address: string): Promise<string>;
    initData(): Promise<string>;
    userLogin(loginUser: LoginUserDto): Promise<import("./vo/login-user.vo").LoginUserVo>;
    adminLogin(loginUser: LoginUserDto): Promise<import("./vo/login-user.vo").LoginUserVo>;
    _toRefresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    adminRefresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    info(userId: number): Promise<UserDetailVo>;
    updatePassword(userId: number, passwordDto: UpdateUserPasswordDto): Promise<string>;
    updatePasswordCaptcha(address: string): Promise<string>;
    updateUserInfo(userId: number, updateUserDto: UpdateUserDto): Promise<string>;
    updateCaptcha(address: string): Promise<string>;
}
