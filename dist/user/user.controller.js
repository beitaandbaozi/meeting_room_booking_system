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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const register_user_dto_1 = require("./dto/register-user.dto");
const email_service_1 = require("../email/email.service");
const redis_service_1 = require("../redis/redis.service");
const login_user_dto_1 = require("./dto/login-user.dto");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const custom_decorator_1 = require("../custom.decorator");
const user_info_vo_1 = require("./vo/user-info.vo");
const update_user_password_dto_1 = require("./dto/update-user-password.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const utils_1 = require("../utils");
const swagger_1 = require("@nestjs/swagger");
const login_user_vo_1 = require("./vo/login-user.vo");
const refresh_token_vo_1 = require("./vo/refresh-token.vo");
const user_list_vo_1 = require("./vo/user-list.vo");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async register(registerUser) {
        return await this.userService.register(registerUser);
    }
    async captcha(address) {
        const code = Math.random().toString().slice(2, 8);
        await this.redisService.set(`captcha_${address}`, code, 5 * 60);
        await this.emailService.sendMail({
            to: address,
            subject: '注册验证码',
            html: `<h1>验证码：${code}</h1>`,
        });
        return '发送邮箱验证码成功';
    }
    async initData() {
        this.userService.initData();
    }
    async login(loginUser) {
        const vo = await this.userService.login(loginUser, false);
        vo.accessToken = this.jwtService.sign({
            userId: vo.userInfo.id,
            username: vo.userInfo.username,
            roles: vo.userInfo.roles,
            permissions: vo.userInfo.permissions,
        }, {
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_TIME') || '30m',
        });
        vo.refreshToken = this.jwtService.sign({ userId: vo.userInfo.id }, {
            expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_TIME') || '7d',
        });
        return vo;
    }
    async adminLogin(loginUser) {
        const vo = await this.userService.login(loginUser, true);
        vo.accessToken = this.jwtService.sign({
            userId: vo.userInfo.id,
            username: vo.userInfo.username,
            roles: vo.userInfo.roles,
            permissions: vo.userInfo.permissions,
        }, {
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_TIME') || '30m',
        });
        vo.refreshToken = this.jwtService.sign({ userId: vo.userInfo.id }, {
            expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_TIME') || '7d',
        });
        return vo;
    }
    async refreshToken(refreshToken, isAdmin) {
        const data = this.jwtService.verify(refreshToken);
        const user = await this.userService.findUserById(data.userId, isAdmin);
        const access_token = this.jwtService.sign({
            userId: user.id,
            username: user.username,
            roles: user.roles,
            permissions: user.permissions,
        }, {
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_TIME') || '30m',
        });
        const refresh_token = this.jwtService.sign({ userId: user.id }, {
            expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_TIME') || '7d',
        });
        const vo = new refresh_token_vo_1.RefreshTokenVo();
        vo.access_token = access_token;
        vo.refresh_token = refresh_token;
        return { access_token: vo.access_token, refresh_token: vo.refresh_token };
    }
    async refresh(refreshToken) {
        try {
            const { access_token, refresh_token } = await this.refreshToken(refreshToken, false);
            return { access_token, refresh_token };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('token 已经失效，请重新登录');
        }
    }
    async refreshAdmin(refreshToken) {
        try {
            const { access_token, refresh_token } = await this.refreshToken(refreshToken, true);
            return { access_token, refresh_token };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('token 已经失效，请重新登录');
        }
    }
    async info(userId) {
        const user = await this.userService.findUserDetailById(userId);
        const userInfoVo = new user_info_vo_1.UserDetailVo();
        userInfoVo.id = user.id;
        userInfoVo.username = user.username;
        userInfoVo.nickName = user.nickName;
        userInfoVo.email = user.email;
        userInfoVo.headPic = user.headPic;
        userInfoVo.phoneNumber = user.phoneNumber;
        userInfoVo.isFrozen = user.isFrozen;
        userInfoVo.createTime = user.createTime;
        return userInfoVo;
    }
    async updatePassword(userId, passwordDto) {
        return await this.userService.updatePassword(userId, passwordDto);
    }
    async getUpdatePasswordCaptcha(address) {
        return await this.userService.getUpdatePasswordCaptcha(address);
    }
    async updateUserInfo(userId, updateUserDto) {
        return await this.userService.updateUserInfo(userId, updateUserDto);
    }
    async getUpdateUserCaptcha(address) {
        return await this.userService.getUpdateUserCaptcha(address);
    }
    async freezeUser(userId) {
        await this.userService.freezeUser(userId);
        return 'freeze success';
    }
    async getUserList(pageNumber, pageSize, username, nickName, email) {
        return await this.userService.getUserList(pageNumber, pageSize, username, nickName, email);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Inject)(jwt_1.JwtService),
    __metadata("design:type", jwt_1.JwtService)
], UserController.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], UserController.prototype, "configService", void 0);
__decorate([
    (0, common_1.Inject)(email_service_1.EmailService),
    __metadata("design:type", email_service_1.EmailService)
], UserController.prototype, "emailService", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserController.prototype, "redisService", void 0);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '验证码失效/验证码错误/用户名已存在',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '注册成功/失败',
        type: String,
    }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'address',
        type: String,
        description: '邮箱地址',
        required: true,
        example: 'xxx@xx.com',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '发送成功',
        type: String,
    }),
    (0, common_1.Get)('register-captcha'),
    __param(0, (0, common_1.Query)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "captcha", null);
__decorate([
    (0, common_1.Get)('init-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "initData", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: login_user_dto_1.LoginUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '用户不存在/密码错误',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '用户信息和token',
        type: login_user_vo_1.LoginUserVo,
    }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: login_user_dto_1.LoginUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '用户不存在/密码错误',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '用户信息和token',
        type: login_user_vo_1.LoginUserVo,
    }),
    (0, common_1.Post)('admin/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminLogin", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'refreshToken',
        type: String,
        description: '刷新token',
        required: true,
        example: 'xxxxxxxxyyyyyyyzzzzz',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: '无效的token',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '刷新token成功',
        type: refresh_token_vo_1.RefreshTokenVo,
    }),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Query)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refresh", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'refreshToken',
        type: String,
        description: '刷新token',
        required: true,
        example: 'xxxxxxxxyyyyyyyzzzzz',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: '无效的token',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '刷新token成功',
        type: refresh_token_vo_1.RefreshTokenVo,
    }),
    (0, common_1.Get)('admin/refresh'),
    __param(0, (0, common_1.Query)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        description: '用户编号',
        type: Number,
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '获取用户信息成功',
        type: user_info_vo_1.UserDetailVo,
    }),
    (0, common_1.Get)('info'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "info", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: update_user_password_dto_1.UpdateUserPasswordDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '验证码已失效/验证码不正确',
        type: String,
    }),
    (0, common_1.Post)(['update_password', 'admin/update_password']),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_password_dto_1.UpdateUserPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'address',
        description: '邮箱地址',
        required: true,
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: '发送成功',
    }),
    (0, common_1.Get)('update_password/captcha'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, common_1.Query)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUpdatePasswordCaptcha", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '验证码已失效/不正确',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '更新成功',
        type: String,
    }),
    (0, common_1.Post)(['update', 'admin/update']),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserInfo", null);
__decorate([
    (0, common_1.Get)('update/captcha'),
    __param(0, (0, common_1.Query)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUpdateUserCaptcha", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'id',
        description: 'userId',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: 'success',
    }),
    (0, common_1.Get)('freeze'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "freezeUser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'pageNo',
        description: '第几页',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        description: '每页多少条',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'username',
        description: '用户名',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'nickName',
        description: '昵称',
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'email',
        description: '邮箱地址',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        type: user_list_vo_1.UserListVo,
        description: '用户列表',
    }),
    (0, common_1.Get)('list'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, common_1.Query)('pageNumber', new common_1.DefaultValuePipe(1), (0, utils_1.validatePageType)('pageNumber'))),
    __param(1, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(10), (0, utils_1.validatePageType)('pageSize'))),
    __param(2, (0, common_1.Query)('username')),
    __param(3, (0, common_1.Query)('nickName')),
    __param(4, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserList", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('用户管理'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map