import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Global()
@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService], // 导出服务，以便在其他模块中使用
})
export class EmailModule {}
