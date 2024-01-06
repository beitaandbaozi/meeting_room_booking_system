"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePageType = exports.md5 = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
exports.md5 = md5;
function validatePageType(name) {
    return new common_1.ParseIntPipe({
        exceptionFactory() {
            throw new common_1.BadRequestException(`🙅${name}类型为数字`);
        },
    });
}
exports.validatePageType = validatePageType;
//# sourceMappingURL=utils.js.map