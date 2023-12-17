import * as crypto from 'crypto';
// todo md5 加密处理
export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}
