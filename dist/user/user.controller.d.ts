import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    private emailService;
    private redisService;
    register(registerUser: RegisterUserDto): Promise<"register success" | "register fail">;
    captcha(address: string): Promise<string>;
}
