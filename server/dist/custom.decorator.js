"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = exports.RequirePermission = exports.RequireLogin = void 0;
const common_1 = require("@nestjs/common");
const RequireLogin = () => (0, common_1.SetMetadata)('require-login', true);
exports.RequireLogin = RequireLogin;
const RequirePermission = (...permissions) => (0, common_1.SetMetadata)('require-permission', permissions);
exports.RequirePermission = RequirePermission;
exports.UserInfo = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user)
        return null;
    return data ? request.user[data] : request.user;
});
//# sourceMappingURL=custom.decorator.js.map