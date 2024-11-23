import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AdminSeedService } from './create-admin.seed';
import { SeedController } from './seed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminSeedService],
  controllers: [SeedController],
  exports: [AdminSeedService],
})
export class SeedModule {}
