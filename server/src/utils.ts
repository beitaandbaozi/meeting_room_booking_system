import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';
import * as multer from 'multer';
import * as fs from 'fs';

// todo md5进行加密处理
export function md5(data: string) {
  const hash = crypto.createHash('md5');
  return hash.update(data).digest('hex');
}

// todo 封装 ParseIntPipe 处理分页参数
export function generateParseIntPipe(name) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + '类型为数字类型🐻');
    },
  });
}

// todo multer 自定义存储方式 multer.diskStorage：磁盘存储
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync('uploads');
    } catch (e) {}
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    cb(null, uniqueSuffix);
  },
});
