"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const redis_service_1 = require("../redis/redis.service");
const utils_1 = require("../utils");
const email_service_1 = require("../email/email.service");
const role_entity_1 = require("./entities/role.entity");
const permission_entity_1 = require("./entities/permission.entity");
let UserService = UserService_1 = class UserService {
    constructor() {
        this.logger = new common_1.Logger();
    }
    async register(user) {
        const captcha = await this.redisService.get(`captcha_${user.email}`);
        if (!captcha) {
            throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.captcha !== captcha) {
            throw new common_1.HttpException('验证码不正确', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundUser = await this.userRepository.findOneBy({
            username: user.username,
        });
        if (foundUser) {
            throw new common_1.HttpException('用户已存在', common_1.HttpStatus.BAD_REQUEST);
        }
        const newUser = new user_entity_1.User();
        newUser.username = user.username;
        newUser.password = (0, utils_1.md5)(user.password);
        newUser.email = user.email;
        newUser.nickName = user.nickName;
        try {
            await this.userRepository.save(newUser);
            return '注册成功';
        }
        catch (e) {
            this.logger.error(e, UserService_1);
            return '注册失败';
        }
    }
    async captcha(address) {
        const code = Math.random().toString().slice(2, 8);
        await this.redisService.set(`captcha_${address}`, code, 5 * 60);
        await this.emailService.sendMail({
            to: address,
            subject: '注册验证码',
            html: `<p>你的注册验证码是 ${code}</p>`,
        });
        return '发送成功';
    }
    async initData() {
        const user1 = new user_entity_1.User();
        user1.username = 'zhangsan';
        user1.password = (0, utils_1.md5)('111111');
        user1.email = 'xxx@xx.com';
        user1.isAdmin = true;
        user1.nickName = '张三';
        user1.phoneNumber = '13233323333';
        const user2 = new user_entity_1.User();
        user2.username = 'lisi';
        user2.password = (0, utils_1.md5)('222222');
        user2.email = 'yy@yy.com';
        user2.nickName = '李四';
        const role1 = new role_entity_1.Role();
        role1.name = '管理员';
        const role2 = new role_entity_1.Role();
        role2.name = '普通用户';
        const permission1 = new permission_entity_1.Permission();
        permission1.code = 'ccc';
        permission1.description = '访问 ccc 接口';
        const permission2 = new permission_entity_1.Permission();
        permission2.code = 'ddd';
        permission2.description = '访问 ddd 接口';
        user1.roles = [role1];
        user2.roles = [role2];
        role1.permissions = [permission1, permission2];
        role2.permissions = [permission1];
        await this.permissionRepository.save([permission1, permission2]);
        await this.roleRepository.save([role1, role2]);
        await this.userRepository.save([user1, user2]);
    }
};
exports.UserService = UserService;
__decorate([
    (0, typeorm_1.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "userRepository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(role_entity_1.Role),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "roleRepository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(permission_entity_1.Permission),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "permissionRepository", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserService.prototype, "redisService", void 0);
__decorate([
    (0, common_1.Inject)(email_service_1.EmailService),
    __metadata("design:type", email_service_1.EmailService)
], UserService.prototype, "emailService", void 0);
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map