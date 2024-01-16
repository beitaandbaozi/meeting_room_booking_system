import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';

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
