/// <reference types="multer" />
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshTokenVo } from './vo/refresh-token.vo';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    private jwtService;
    private configService;
    register(registerUser: RegisterUserDto): Promise<"注册成功" | "注册失败">;
    captcha(address: string): Promise<string>;
    initData(): Promise<string>;
    userLogin(loginUser: LoginUserDto): Promise<LoginUserVo>;
    adminLogin(loginUser: LoginUserDto): Promise<LoginUserVo>;
    _toRefresh(refreshToken: string): Promise<RefreshTokenVo>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    adminRefresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    info(userId: number): Promise<UserDetailVo>;
    updatePassword(passwordDto: UpdateUserPasswordDto): Promise<"密码修改成功" | "密码修改失败">;
    updatePasswordCaptcha(address: string): Promise<string>;
    updateUserInfo(userId: number, updateUserDto: UpdateUserDto): Promise<string>;
    updateCaptcha(address: string): Promise<string>;
    freeze(userId: number): Promise<string>;
    list(pageNo: number, pageSize: number, username: string, nickName: string, email: string): Promise<import("./vo/user-list.vo").UserListVo>;
    uploadFile(file: Express.Multer.File): string;
}
