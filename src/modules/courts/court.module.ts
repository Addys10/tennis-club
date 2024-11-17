import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Court } from '../../entities/court.entity';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Court])],
  providers: [CourtsService],
  controllers: [CourtsController],
  exports: [CourtsService],
})
export class CourtsModule {}
