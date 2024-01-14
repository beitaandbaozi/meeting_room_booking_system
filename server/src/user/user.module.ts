import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [
    // ??? 注入 Repository 需要在对应的 module 引入 TypeOrm.forFeature
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
