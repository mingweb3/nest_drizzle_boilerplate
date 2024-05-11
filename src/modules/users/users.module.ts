import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DbModule } from '@db/db.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DbModule],
})
export class UsersModule {}
