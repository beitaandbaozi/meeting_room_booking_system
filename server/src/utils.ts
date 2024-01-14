import * as crypto from 'crypto';

// todo md5进行加密处理
export function md5(data: string) {
  const hash = crypto.createHash('md5');
  return hash.update(data).digest('hex');
}
