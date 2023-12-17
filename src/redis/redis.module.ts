import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from '@redis/client';
// todo 将redis模块设置成全部模块，这样只需要在 AppModule 引入，其他模块不需要引入
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: '127.0.0.1',
            port: 6379,
          },
          database: 1,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
