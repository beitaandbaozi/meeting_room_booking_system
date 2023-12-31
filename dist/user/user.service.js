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
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const redis_service_1 = require("../redis/redis.service");
const typeorm_2 = require("typeorm");
const utils_1 = require("../utils");
const role_entity_1 = require("./entities/role.entity");
const permission_entity_1 = require("./entities/permission.entity");
const login_user_vo_1 = require("./vo/login-user.vo");
const email_service_1 = require("../email/email.service");
const user_list_vo_1 = require("./vo/user-list.vo");
let UserService = UserService_1 = class UserService {
    constructor() {
        this.logger = new common_1.Logger();
    }
    async initData() {
        const user1 = new user_entity_1.User();
        user1.username = 'admin';
        user1.password = (0, utils_1.md5)('admin');
        user1.email = 'admin@qq.com';
        user1.isAdmin = true;
        user1.nickName = '管理员';
        user1.phoneNumber = '13800000000';
        const user2 = new user_entity_1.User();
        user2.username = 'gai';
        user2.password = (0, utils_1.md5)('gai');
        user2.email = 'gai@qq.com';
        user2.nickName = 'gai';
        user2.phoneNumber = '13800000001';
        const role1 = new role_entity_1.Role();
        role1.name = '管理员';
        const role2 = new role_entity_1.Role();
        role2.name = '普通用户';
        const permission1 = new permission_entity_1.Permission();
        permission1.code = 'ccc';
        permission1.description = '访问ccc窗口';
        const permission2 = new permission_entity_1.Permission();
        permission2.code = 'ddd';
        permission2.description = '访问ddd窗口';
        user1.roles = [role1];
        user2.roles = [role2];
        role1.permissions = [permission1, permission2];
        role2.permissions = [permission2];
        await this.permissionRepository.save([permission1, permission2]);
        await this.roleRepository.save([role1, role2]);
        await this.userRepository.save([user1, user2]);
    }
    async register(userData) {
        const captcha = await this.redisService.get(`captcha_${userData.email}`);
        if (!captcha)
            throw new common_1.HttpException('验证码失效', common_1.HttpStatus.BAD_REQUEST);
        if (userData.captcha !== captcha) {
            throw new common_1.HttpException('验证码错误', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundUser = await this.userRepository.findOneBy({
            username: userData.username,
        });
        if (foundUser) {
            throw new common_1.HttpException('用户名已存在', common_1.HttpStatus.BAD_REQUEST);
        }
        const newUser = new user_entity_1.User();
        newUser.username = userData.username;
        newUser.password = (0, utils_1.md5)(userData.password);
        newUser.email = userData.email;
        newUser.nickName = userData.nickName;
        try {
            await this.userRepository.save(newUser);
            return 'register success';
        }
        catch (error) {
            this.logger.error(error, UserService_1);
            return 'register fail';
        }
    }
    async login(loginUser, isAdmin) {
        const user = await this.userRepository.findOne({
            where: {
                username: loginUser.username,
                isAdmin,
            },
            relations: ['roles', 'roles.permissions'],
        });
        console.log('user', user);
        if (!user)
            throw new common_1.HttpException('用户不存在！', common_1.HttpStatus.BAD_REQUEST);
        if (user.password !== (0, utils_1.md5)(loginUser.password)) {
            throw new common_1.HttpException('密码错误！', common_1.HttpStatus.BAD_REQUEST);
        }
        const vo = new login_user_vo_1.LoginUserVo();
        vo.userInfo = {
            id: user.id,
            username: user.username,
            nickName: user.nickName,
            email: user.email,
            headPic: user.headPic,
            phoneNumber: user.phoneNumber,
            isFrozen: user.isFrozen,
            isAdmin: user.isAdmin,
            createTime: user.createTime,
            roles: user.roles.map((item) => item.name),
            permissions: user.roles.reduce((arr, item) => {
                item.permissions.forEach((permission) => {
                    if (arr.indexOf(permission) === -1) {
                        arr.push(permission);
                    }
                });
                return arr;
            }, []),
        };
        return vo;
    }
    async findUserById(userId, isAdmin) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
                isAdmin,
            },
            relations: ['roles', 'roles.permissions'],
        });
        return {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            roles: user.roles.map((item) => item.name),
            permissions: user.roles.reduce((arr, item) => {
                item.permissions.forEach((permission) => {
                    if (arr.indexOf(permission) === -1) {
                        arr.push(permission);
                    }
                });
                return arr;
            }, []),
        };
    }
    async findUserDetailById(userId) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
        return user;
    }
    async updatePassword(userId, passwordDto) {
        const captcha = await this.redisService.get(`update_password_captcha_${passwordDto.email}`);
        if (!captcha) {
            throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.BAD_REQUEST);
        }
        if (passwordDto.captcha !== captcha) {
            throw new common_1.HttpException('验证码不正确', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundUser = await this.userRepository.findOneBy({ id: userId });
        foundUser.password = (0, utils_1.md5)(passwordDto.password);
        try {
            await this.userRepository.save(foundUser);
            return '修改密码成功！😆';
        }
        catch (error) {
            this.logger.error(error, UserService_1);
            return '修改密码失败！😭';
        }
    }
    async getUpdatePasswordCaptcha(address) {
        const code = Math.random().toString().slice(2, 8);
        await this.redisService.set(`update_password_captcha_${address}`, code, 10 * 60);
        await this.emailService.sendMail({
            to: address,
            subject: '更改密码验证码',
            html: `<p>您的验证码是：${code}</p>`,
        });
        return '发送成功！😊';
    }
    async updateUserInfo(userId, updateUserDto) {
        const captcha = await this.redisService.get(`update_user_captcha_${updateUserDto.email}`);
        if (!captcha) {
            throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.BAD_REQUEST);
        }
        if (updateUserDto.captcha !== captcha) {
            throw new common_1.HttpException('验证码不正确', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundUser = await this.userRepository.findOneBy({ id: userId });
        if (updateUserDto.nickName) {
            foundUser.nickName = updateUserDto.nickName;
        }
        if (updateUserDto.headPic) {
            foundUser.headPic = updateUserDto.headPic;
        }
        try {
            await this.userRepository.save(foundUser);
            return '修改成功！😊';
        }
        catch (error) {
            this.logger.error(error, UserService_1);
            return '修改失败！😢';
        }
    }
    async getUpdateUserCaptcha(address) {
        const captcha = Math.random.toString().slice(2, 8);
        await this.redisService.set(`update_user_captcha_${address}`, captcha, 10 * 60);
        await this.emailService.sendMail({
            to: address,
            subject: '更改个人信息验证码',
            html: `<p>您的验证码是：${captcha}</p>`,
        });
        return '验证码已发送，请查收！😊';
    }
    async freezeUser(userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new common_1.HttpException('用户不存在', common_1.HttpStatus.BAD_REQUEST);
        user.isFrozen = true;
        await this.userRepository.save(user);
    }
    async getUserList(pageNumber, pageSize, username, nickName, email) {
        const skipCount = (pageNumber - 1) * pageSize;
        const condition = {};
        if (username)
            condition.username = (0, typeorm_2.Like)(`%${username}%`);
        if (nickName)
            condition.nickName = (0, typeorm_2.Like)(`%${nickName}%`);
        if (email)
            condition.email = (0, typeorm_2.Like)(`%${email}%`);
        const [users, totalCount] = await this.userRepository.findAndCount({
            select: [
                'id',
                'username',
                'nickName',
                'email',
                'phoneNumber',
                'isFrozen',
                'headPic',
                'createTime',
            ],
            skip: skipCount,
            take: pageSize,
            where: condition,
        });
        const vo = new user_list_vo_1.UserListVo();
        vo.users = users;
        vo.totalCount = totalCount;
        return vo;
    }
};
exports.UserService = UserService;
__decorate([
    (0, typeorm_1.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "userRepository", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserService.prototype, "redisService", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(role_entity_1.Role),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "roleRepository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(permission_entity_1.Permission),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "permissionRepository", void 0);
__decorate([
    (0, common_1.Inject)(email_service_1.EmailService),
    __metadata("design:type", email_service_1.EmailService)
], UserService.prototype, "emailService", void 0);
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map