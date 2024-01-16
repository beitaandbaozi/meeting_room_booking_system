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
const login_user_dto_1 = require("./dto/login-user.dto");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const custom_decorator_1 = require("../custom.decorator");
const user_info_vo_1 = require("./vo/user-info.vo");
const update_user_password_dto_1 = require("./dto/update-user-password.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    register(registerUser) {
        return this.userService.register(registerUser);
    }
    async captcha(address) {
        return this.userService.captcha(address);
    }
    async initData() {
        await this.userService.initData();
        return 'done';
    }
    async userLogin(loginUser) {
        const vo = await this.userService.login(loginUser, false);
        vo.accessToken = this.jwtService.sign({
            userId: vo.userInfo.id,
            username: vo.userInfo.username,
            roles: vo.userInfo.roles,
            permissions: vo.userInfo.permissions,
        }, {
            expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
        });
        vo.refreshToken = this.jwtService.sign({
            userId: vo.userInfo.id,
        }, {
            expiresIn: this.configService.get('jwt_refresh_token_expires_time') || '7d',
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
            expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
        });
        vo.refreshToken = this.jwtService.sign({
            userId: vo.userInfo.id,
        }, {
            expiresIn: this.configService.get('jwt_refresh_token_expires_time') || '7d',
        });
        return vo;
    }
    async _toRefresh(refreshToken) {
        try {
            const data = this.jwtService.verify(refreshToken);
            const user = await this.userService.findUserById(data.userId, false);
            const access_token = this.jwtService.sign({
                userId: user.id,
                username: user.username,
                roles: user.roles,
                permissions: user.permissions,
            }, {
                expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
            });
            const refresh_token = this.jwtService.sign({
                userId: user.id,
            }, {
                expiresIn: this.configService.get('jwt_refresh_token_expires_time') || '7d',
            });
            return {
                access_token,
                refresh_token,
            };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('token 已失效，请重新登录');
        }
    }
    async refresh(refreshToken) {
        const { access_token, refresh_token } = await this._toRefresh(refreshToken);
        return { access_token, refresh_token };
    }
    async adminRefresh(refreshToken) {
        const { access_token, refresh_token } = await this._toRefresh(refreshToken);
        return { access_token, refresh_token };
    }
    async info(userId) {
        const user = await this.userService.findUserDetailById(userId);
        const vo = new user_info_vo_1.UserDetailVo();
        vo.id = user.id;
        vo.email = user.email;
        vo.username = user.username;
        vo.headPic = user.headPic;
        vo.phoneNumber = user.phoneNumber;
        vo.nickName = user.nickName;
        vo.createTime = user.createTime;
        vo.isFrozen = user.isFrozen;
        return vo;
    }
    async updatePassword(userId, passwordDto) {
        console.log(passwordDto);
        return 'success';
    }
    async updatePasswordCaptcha(address) {
        return await this.userService.updatePasswordCaptcha(address);
    }
    async updateUserInfo(userId, updateUserDto) {
        return await this.userService.updateUserInfo(userId, updateUserDto);
    }
    async updateCaptcha(address) {
        return await this.userService.updateCaptcha(address);
    }
    async freeze(userId) {
        await this.userService.freezeUserById(userId);
        return 'success';
    }
    async list(pageNo, pageSize) {
        return await this.userService.findUsersByPage(pageNo, pageSize);
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
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "register", null);
__decorate([
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
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userLogin", null);
__decorate([
    (0, common_1.Post)('admin/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Query)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('admin/refresh'),
    __param(0, (0, common_1.Query)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminRefresh", null);
__decorate([
    (0, common_1.Get)('info'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "info", null);
__decorate([
    (0, common_1.Post)(['update_password', 'admin/update_password']),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_password_dto_1.UpdateUserPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)('update_password/captcha'),
    __param(0, (0, common_1.Query)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePasswordCaptcha", null);
__decorate([
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
], UserController.prototype, "updateCaptcha", null);
__decorate([
    (0, common_1.Get)('freeze'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "freeze", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('pageNo', new common_1.ParseIntPipe({
        exceptionFactory() {
            throw new common_1.BadRequestException('pageNo 应该传数字');
        },
    }))),
    __param(1, (0, common_1.Query)('pageSize', new common_1.ParseIntPipe({
        exceptionFactory() {
            throw new common_1.BadRequestException('pageSize 应该传数字');
        },
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map