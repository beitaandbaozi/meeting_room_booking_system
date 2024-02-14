"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnLoginFilter = exports.UnLoginException = void 0;
const common_1 = require("@nestjs/common");
class UnLoginException {
    constructor(message) {
        this.message = message;
    }
}
exports.UnLoginException = UnLoginException;
let UnLoginFilter = class UnLoginFilter {
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        response
            .json({
            code: common_1.HttpStatus.UNAUTHORIZED,
            message: 'fail😭',
            data: exception.message || '用户未登录',
        })
            .end();
    }
};
exports.UnLoginFilter = UnLoginFilter;
exports.UnLoginFilter = UnLoginFilter = __decorate([
    (0, common_1.Catch)(UnLoginException)
], UnLoginFilter);
//# sourceMappingURL=unlogin.filter.js.map