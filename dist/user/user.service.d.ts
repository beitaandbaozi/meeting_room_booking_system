import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
export declare class UserService {
    private logger;
    private userRepository;
    private redisService;
    private roleRepository;
    private permissionRepository;
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
}
