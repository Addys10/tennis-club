import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from '../../entities/training.entity';
import { UsersModule } from '../users/users.module';
import { CourtsModule } from '../courts/court.module';
import { TrainingsController } from './training.controller';
import { TrainingsService } from './training.service';

@Module({
  imports: [TypeOrmModule.forFeature([Training]), UsersModule, CourtsModule],
  controllers: [TrainingsController],
  providers: [TrainingsService],
  exports: [TrainingsService],
})
export class TrainingsModule {}
