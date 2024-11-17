import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../../entities/booking.entity';
import { CreateBookingDto } from './dto/bookings.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.findOne(+id);
  }

  @Get('user/:userId')
  findUserBookings(@Param('userId') userId: string): Promise<Booking[]> {
    return this.bookingsService.findUserBookings(+userId);
  }

  @Patch(':id/cancel')
  cancelBooking(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.cancelBooking(+id);
  }

  @Patch(':id/confirm')
  confirmBooking(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.confirmBooking(+id);
  }

  @Get('court/:courtId/available-slots')
  getAvailableTimeSlots(
    @Param('courtId') courtId: string,
    @Query('date') date: string,
  ): Promise<{ startTime: Date; endTime: Date }[]> {
    return this.bookingsService.getAvailableTimeSlots(+courtId, new Date(date));
  }
}
