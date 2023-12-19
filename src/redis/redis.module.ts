import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from '@redis/client';
import { ConfigService } from '@nestjs/config';
// todo 将redis模块设置成全部模块，这样只需要在 AppModule 引入，其他模块不需要引入
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('REDIS_SERVER_HOST'),
            port: configService.get('REDIS_SERVER_PORT'),
          },
          database: configService.get('REDIS_SERVER_DB'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
