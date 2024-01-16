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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const unlogin_filter_1 = require("../filter/unlogin.filter");
let LoginGuard = class LoginGuard {
    canActivate(context) {
        const isRequireLogin = this.reflector.getAllAndOverride('require-login', [
            context.getClass(),
            context.getHandler(),
        ]);
        if (!isRequireLogin)
            return true;
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        if (!authorization) {
            throw new unlogin_filter_1.UnLoginException('用户未登录😷');
        }
        try {
            const token = authorization.split(' ')[1];
            const data = this.jwtService.verify(token);
            request.user = {
                userId: data.userId,
                username: data.username,
                roles: data.roles,
                permissions: data.permissions,
            };
            return true;
        }
        catch (error) {
            throw new unlogin_filter_1.UnLoginException('token失效,请重新登录🫡');
        }
    }
};
exports.LoginGuard = LoginGuard;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", core_1.Reflector)
], LoginGuard.prototype, "reflector", void 0);
__decorate([
    (0, common_1.Inject)(jwt_1.JwtService),
    __metadata("design:type", jwt_1.JwtService)
], LoginGuard.prototype, "jwtService", void 0);
exports.LoginGuard = LoginGuard = __decorate([
    (0, common_1.Injectable)()
], LoginGuard);
//# sourceMappingURL=login.guard.js.map