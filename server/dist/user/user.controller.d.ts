import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(registerUser: RegisterUserDto): Promise<"注册成功" | "注册失败">;
    captcha(address: string): Promise<string>;
    initData(): Promise<string>;
}
