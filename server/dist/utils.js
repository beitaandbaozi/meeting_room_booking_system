"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateParseIntPipe = exports.md5 = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
function md5(data) {
    const hash = crypto.createHash('md5');
    return hash.update(data).digest('hex');
}
exports.md5 = md5;
function generateParseIntPipe(name) {
    return new common_1.ParseIntPipe({
        exceptionFactory() {
            throw new common_1.BadRequestException(name + '类型为数字类型🐻');
        },
    });
}
exports.generateParseIntPipe = generateParseIntPipe;
//# sourceMappingURL=utils.js.map