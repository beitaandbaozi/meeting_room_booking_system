import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';
// todo md5 加密处理
export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}
// todo 分页类型校验
export function validatePageType(name: string) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(`🙅${name}类型为数字`);
    },
  });
}
