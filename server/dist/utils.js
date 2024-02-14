"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.generateParseIntPipe = exports.md5 = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
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
exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            fs.mkdirSync('uploads');
        }
        catch (e) { }
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            '-' +
            file.originalname;
        cb(null, uniqueSuffix);
    },
});
//# sourceMappingURL=utils.js.map