import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
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

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(Training)
    private trainingRepository: Repository<Training>,
    private usersService: UsersService,
    private courtsService: CourtsService,
  ) {}

  async create(createTrainingDto: CreateTrainingDto): Promise<Training> {
    const coach = await this.usersService.findOne(createTrainingDto.coachId);
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    const court = await this.courtsService.findOne(createTrainingDto.courtId);
    if (!court) {
      throw new NotFoundException('Court not found');
    }

    // Kontrola dostupnosti trenéra
    const coachConflict = await this.checkCoachAvailability(
      createTrainingDto.coachId,
      createTrainingDto.startTime,
      createTrainingDto.endTime,
    );
    if (coachConflict) {
      throw new BadRequestException('Coach is not available at this time');
    }

    // Kontrola dostupnosti kurtu
    const courtConflict = await this.checkCourtAvailability(
      createTrainingDto.courtId,
      createTrainingDto.startTime,
      createTrainingDto.endTime,
    );
    if (courtConflict) {
      throw new BadRequestException('Court is not available at this time');
    }

    let players = [];
    if (createTrainingDto.playerIds) {
      players = await Promise.all(
        createTrainingDto.playerIds.map((id) => this.usersService.findOne(id)),
      );
    }

    const training = this.trainingRepository.create({
      ...createTrainingDto,
      coach,
      court,
      players,
    });

    return this.trainingRepository.save(training);
  }

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

  private async checkCoachAvailability(
    coachId: number,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const conflictingTraining = await this.trainingRepository.findOne({
      where: {
        coach: { id: coachId },
        startTime: Between(startTime, endTime),
        status: TrainingStatus.CONFIRMED,
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
        startTime: Between(startTime, endTime),
        status: TrainingStatus.CONFIRMED,
      },
    });
    return !!conflictingTraining;
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
}
