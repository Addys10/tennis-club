import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
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
}
