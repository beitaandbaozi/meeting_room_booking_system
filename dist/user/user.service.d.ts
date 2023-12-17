import { RegisterUserDto } from './dto/register-user.dto';
export declare class UserService {
    private logger;
    private userRepository;
    private redisService;
    register(userData: RegisterUserDto): Promise<"register success" | "register fail">;
}
