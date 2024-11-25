import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { Training } from '../../entities/training.entity';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UsersService } from '../users/users.service';
import { CourtsService } from '../courts/courts.service';
import { TrainingStatus } from '../../enums/training-status.enum';
import { TRAINING_CONSTRAINTS, TRAINING_PRICING } from './training.constants';
import { UserRole } from '../../enums/user-role.enum';
import { User } from '../../entities/user.entity';
import { Court } from '../../entities/court.entity';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(Training)
    private trainingRepository: Repository<Training>,
    private usersService: UsersService,
    private courtsService: CourtsService,
  ) {}

  async findAll(): Promise<Training[]> {
    return this.trainingRepository.find({
      relations: ['players'],
    });
  }

  async findOne(id: number): Promise<Training> {
    const training = await this.trainingRepository.findOne({
      where: { id },
      relations: ['players'],
    });
    if (!training) {
      throw new NotFoundException('Training not found');
    }
    return training;
  }

  async findByCoach(coachId: number): Promise<Training[]> {
    return this.trainingRepository.find({
      where: { coach: { id: coachId } },
      relations: ['players'],
    });
  }

  async findByPlayer(playerId: number): Promise<Training[]> {
    return this.trainingRepository.find({
      relations: ['players'],
      where: { players: { id: playerId } },
    });
  }

  async cancelTraining(id: number): Promise<Training> {
    const training = await this.findOne(id);
    if (!training) {
      throw new NotFoundException('Training not found');
    }

    training.status = TrainingStatus.CANCELLED;
    return this.trainingRepository.save(training);
  }

  async updateStatus(id: number, status: TrainingStatus): Promise<Training> {
    const training = await this.findOne(id);
    if (!training) {
      throw new NotFoundException('Training not found');
    }

    training.status = status;
    return this.trainingRepository.save(training);
  }

  async getCurrentTrainings(): Promise<Training[]> {
    const now = new Date();
    return this.trainingRepository.find({
      where: {
        startTime: LessThanOrEqual(now),
        endTime: MoreThanOrEqual(now),
        status: Not(TrainingStatus.CANCELLED),
      },
      relations: ['coach', 'players', 'court'],
    });
  }

  async getFutureTrainings(): Promise<Training[]> {
    const now = new Date();
    return this.trainingRepository.find({
      where: {
        startTime: MoreThan(now),
        status: Not(TrainingStatus.CANCELLED),
      },
      relations: ['coach', 'players', 'court'],
      order: { startTime: 'ASC' },
    });
  }

  async getTrainingHistory(): Promise<Training[]> {
    const now = new Date();
    return this.trainingRepository.find({
      order: { startTime: 'DESC' },
      relations: ['coach', 'players', 'court'],
      where: {
        endTime: LessThan(now),
      },
    });
  }

  private parseDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    return date;
  }

  private async checkCoachAvailability(
    coachId: number,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const conflictingTraining = await this.trainingRepository.findOne({
      where: {
        coach: { id: coachId },
        startTime: LessThanOrEqual(endTime),
        endTime: MoreThanOrEqual(startTime),
        status: Not(TrainingStatus.CANCELLED),
      },
    });
    return !!conflictingTraining;
  }

  private async checkCourtAvailability(
    courtId: number,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const conflictingTraining = await this.trainingRepository.findOne({
      where: {
        court: { id: courtId },
        startTime: LessThanOrEqual(endTime),
        endTime: MoreThanOrEqual(startTime),
        status: Not(TrainingStatus.CANCELLED),
      },
    });
    return !!conflictingTraining;
  }

  private validateTrainingTime(startTime: Date, endTime: Date) {
    const now = new Date();
    const durationMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const advanceHours =
      (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const maxAdvanceDate = new Date();
    maxAdvanceDate.setDate(
      maxAdvanceDate.getDate() + TRAINING_CONSTRAINTS.MAX_ADVANCE_BOOKING_DAYS,
    );

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (durationMinutes < TRAINING_CONSTRAINTS.MIN_DURATION_MINUTES) {
      throw new BadRequestException(
        `Training must be at least ${TRAINING_CONSTRAINTS.MIN_DURATION_MINUTES} minutes long`,
      );
    }

    if (durationMinutes > TRAINING_CONSTRAINTS.MAX_DURATION_MINUTES) {
      throw new BadRequestException(
        `Training cannot be longer than ${TRAINING_CONSTRAINTS.MAX_DURATION_MINUTES} minutes`,
      );
    }

    if (advanceHours < TRAINING_CONSTRAINTS.MIN_ADVANCE_BOOKING_HOURS) {
      throw new BadRequestException(
        `Training must be booked at least ${TRAINING_CONSTRAINTS.MIN_ADVANCE_BOOKING_HOURS} hours in advance`,
      );
    }

    if (startTime > maxAdvanceDate) {
      throw new BadRequestException(
        `Training cannot be booked more than ${TRAINING_CONSTRAINTS.MAX_ADVANCE_BOOKING_DAYS} days in advance`,
      );
    }
  }

  private calculateTrainingPrice(
    coach: User,
    court: Court,
    startTime: Date,
    endTime: Date,
    playerCount: number,
  ): number {
    // Základní cena podle hodinové sazby trenéra nebo výchozí ceny
    const baseRate = coach.hourlyRate || TRAINING_PRICING.BASE_PRICE_PER_HOUR;
    const durationHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    let price = baseRate * durationHours;

    // Příplatek za každého dalšího hráče
    if (playerCount > 1) {
      price +=
        (playerCount - 1) * TRAINING_PRICING.PLAYER_SURCHARGE * durationHours;
    }

    // Příplatek za prémiový povrch
    if (['antuka', 'tráva'].includes(court.surface.toLowerCase())) {
      price += TRAINING_PRICING.PREMIUM_SURFACE_SURCHARGE * durationHours;
    }

    return Math.round(price);
  }

  async create(createTrainingDto: CreateTrainingDto): Promise<Training> {
    try {
      // Převod string datumů na Date objekty
      const startTime = this.parseDate(createTrainingDto.startTime);
      const endTime = this.parseDate(createTrainingDto.endTime);

      // Validace času
      this.validateTrainingTime(startTime, endTime);

      // Validace trenéra
      const coach = await this.usersService.findOne(createTrainingDto.coachId);
      if (!coach || coach.role !== UserRole.COACH) {
        throw new BadRequestException(
          'Invalid coach ID or user is not a coach',
        );
      }

      if (!coach.isActive) {
        throw new BadRequestException('Coach is not active');
      }

      // Validace kurtu
      const court = await this.courtsService.findOne(createTrainingDto.courtId);
      if (!court || !court.isAvailable) {
        throw new BadRequestException('Court is not available');
      }

      // Kontrola dostupnosti
      const [coachConflict, courtConflict] = await Promise.all([
        this.checkCoachAvailability(
          createTrainingDto.coachId,
          startTime,
          endTime,
        ),
        this.checkCourtAvailability(
          createTrainingDto.courtId,
          startTime,
          endTime,
        ),
      ]);

      if (coachConflict) {
        throw new BadRequestException('Coach is not available at this time');
      }

      if (courtConflict) {
        throw new BadRequestException('Court is not available at this time');
      }

      // Zpracování hráčů
      const playerIds = Array.isArray(createTrainingDto.playerIds)
        ? createTrainingDto.playerIds
        : [];

      const players = await Promise.all(
        playerIds.map((id) => this.usersService.findOne(id)),
      );

      const invalidPlayers = players.filter(
        (player) =>
          !player || ![UserRole.PLAYER, UserRole.MEMBER].includes(player.role),
      );

      if (invalidPlayers.length > 0) {
        throw new BadRequestException(
          'Some player IDs are invalid or users are not players',
        );
      }

      // Kontrola maximálního počtu hráčů
      const maxPlayers =
        createTrainingDto.maxPlayers ||
        TRAINING_CONSTRAINTS.DEFAULT_MAX_PLAYERS;
      if (players.length > maxPlayers) {
        throw new BadRequestException('Too many players for this training');
      }

      // Výpočet ceny
      const price =
        createTrainingDto.price ||
        this.calculateTrainingPrice(
          coach,
          court,
          startTime,
          endTime,
          players.length,
        );

      // Vytvoření tréninku
      const training = this.trainingRepository.create({
        startTime,
        endTime,
        coach,
        court,
        players,
        price,
        notes: createTrainingDto.notes,
        maxPlayers,
        status: TrainingStatus.PLANNED,
      });

      return await this.trainingRepository.save(training);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Error creating training');
    }
  }
}
