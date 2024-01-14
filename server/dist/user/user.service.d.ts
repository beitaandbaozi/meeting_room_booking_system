import { RegisterUserDto } from './dto/register-user.dto';
export declare class UserService {
    private logger;
    private userRepository;
    private redisService;
    private emailService;
    register(user: RegisterUserDto): Promise<"注册成功" | "注册失败">;
    captcha(address: string): Promise<string>;
}
