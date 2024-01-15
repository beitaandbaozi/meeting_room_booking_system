"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermission = exports.RequireLogin = void 0;
const common_1 = require("@nestjs/common");
const RequireLogin = () => (0, common_1.SetMetadata)('require-login', true);
exports.RequireLogin = RequireLogin;
const RequirePermission = (...permissions) => (0, common_1.SetMetadata)('require-permission', permissions);
exports.RequirePermission = RequirePermission;
//# sourceMappingURL=custom.decorator.js.map