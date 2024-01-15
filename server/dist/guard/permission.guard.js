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
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let PermissionGuard = class PermissionGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (!request.user)
            return true;
        const requiredPermissions = this.reflector.getAllAndOverride('require-permission', [context.getHandler(), context.getClass()]);
        if (!requiredPermissions)
            return true;
        const permissions = request.user.permissions;
        for (let i = 0; i < requiredPermissions.length; i++) {
            const curPermission = requiredPermissions[i];
            const found = permissions.find((item) => item.code === curPermission);
            if (!found) {
                throw new common_1.UnauthorizedException('您没有访问该接口的权限');
            }
        }
        return true;
    }
};
exports.PermissionGuard = PermissionGuard;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", core_1.Reflector)
], PermissionGuard.prototype, "reflector", void 0);
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)()
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map