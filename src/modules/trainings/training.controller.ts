import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TrainingsService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../enums/user-role.enum';
import { Training } from '../../entities/training.entity';
import { TrainingStatus } from '../../enums/training-status.enum';

@Controller('trainings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  @Roles(UserRole.COACH, UserRole.ADMIN)
  create(@Body() createTrainingDto: CreateTrainingDto) {
    return this.trainingsService.create(createTrainingDto);
  }

  @Get()
  findAll() {
    return this.trainingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingsService.findOne(+id);
  }

  @Get('coach/:coachId')
  findByCoach(@Param('coachId') coachId: string) {
    return this.trainingsService.findByCoach(+coachId);
  }

  @Get('player/:playerId')
  findByPlayer(@Param('playerId') playerId: string) {
    return this.trainingsService.findByPlayer(+playerId);
  }

  @Patch(':id/cancel')
  async cancelTraining(@Param('id') id: string): Promise<Training> {
    return this.trainingsService.cancelTraining(+id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TrainingStatus,
  ): Promise<Training> {
    return this.trainingsService.updateStatus(+id, status);
  }

  @Get('current')
  async getCurrentTrainings(): Promise<Training[]> {
    return this.trainingsService.getCurrentTrainings();
  }

  @Get('future')
  async getFutureTrainings(): Promise<Training[]> {
    return this.trainingsService.getFutureTrainings();
  }

  @Get('history')
  async getTrainingHistory(): Promise<Training[]> {
    return this.trainingsService.getTrainingHistory();
  }
}
