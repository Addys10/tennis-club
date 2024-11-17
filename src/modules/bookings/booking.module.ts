import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../../entities/booking.entity';
import { UsersModule } from '../users/users.module';
import { CourtsModule } from '../courts/court.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), UsersModule, CourtsModule],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
