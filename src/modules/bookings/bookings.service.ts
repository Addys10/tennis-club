import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';
import { UsersService } from '../users/users.service';
import { CourtsService } from '../courts/courts.service';
import { CreateBookingDto } from './dto/bookings.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private usersService: UsersService,
    private courtsService: CourtsService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Check if the court exists and is available
    const court = await this.courtsService.findOne(createBookingDto.courtId);
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    if (!court.isAvailable) {
      throw new BadRequestException('Court is not available');
    }

    // Check if the user exists
    const user = await this.usersService.findOne(createBookingDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate booking time
    if (createBookingDto.startTime >= createBookingDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check for overlapping bookings
    const overlappingBooking = await this.bookingsRepository.findOne({
      where: {
        court: { id: createBookingDto.courtId },
        startTime: Between(
          createBookingDto.startTime,
          createBookingDto.endTime,
        ),
        status: 'confirmed',
      },
    });

    if (overlappingBooking) {
      throw new BadRequestException(
        'Court is already booked for this time slot',
      );
    }

    const booking = this.bookingsRepository.create({
      user: { id: createBookingDto.userId },
      court: { id: createBookingDto.courtId },
      startTime: createBookingDto.startTime,
      endTime: createBookingDto.endTime,
      status: createBookingDto.status,
    });

    return this.bookingsRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['user', 'court'],
    });
  }

  async findOne(id: number): Promise<Booking> {
    return this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'court'],
    });
  }

  async findUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['court'],
    });
  }

  async cancelBooking(id: number): Promise<Booking> {
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.status = 'cancelled';
    return this.bookingsRepository.save(booking);
  }

  async confirmBooking(id: number): Promise<Booking> {
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.status = 'confirmed';
    return this.bookingsRepository.save(booking);
  }

  async getAvailableTimeSlots(
    courtId: number,
    date: Date,
  ): Promise<{ startTime: Date; endTime: Date }[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.bookingsRepository.find({
      where: {
        court: { id: courtId },
        startTime: Between(startOfDay, endOfDay),
        status: 'confirmed',
      },
      order: { startTime: 'ASC' },
    });

    // Generate available time slots (assuming operating hours 8:00-22:00)
    const slots: { startTime: Date; endTime: Date }[] = [];
    const openingTime = new Date(date);
    openingTime.setHours(8, 0, 0, 0);
    const closingTime = new Date(date);
    closingTime.setHours(22, 0, 0, 0);

    let currentTime = openingTime;

    for (const booking of bookings) {
      if (currentTime < booking.startTime) {
        slots.push({
          startTime: new Date(currentTime),
          endTime: new Date(booking.startTime),
        });
      }
      currentTime = booking.endTime;
    }

    if (currentTime < closingTime) {
      slots.push({
        startTime: new Date(currentTime),
        endTime: new Date(closingTime),
      });
    }

    return slots;
  }
}
