import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../../enums/user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get('coaches')
  findAllCoaches(): Promise<User[]> {
    return this.usersService.findAllCoaches();
  }

  @Patch('coaches/:id/availability')
  updateCoachAvailability(
    @Param('id') id: string,
    @Body() availability: any,
  ): Promise<User> {
    return this.usersService.updateCoachAvailability(+id, availability);
  }

  @Patch('coaches/:id/specialization')
  updateCoachSpecialization(
    @Param('id') id: string,
    @Body() specialization: string[],
  ): Promise<User> {
    return this.usersService.updateCoachSpecialization(+id, specialization);
  }

  @Get()
  findAll(@Query() filters: any): Promise<User[]> {
    return this.usersService.findAllWithFilters(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/role')
  setRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ): Promise<User> {
    return this.usersService.setRole(+id, role);
  }
}
