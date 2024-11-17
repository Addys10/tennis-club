import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { Court } from '../../entities/court.entity';

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  create(@Body() createCourtDto: CreateCourtDto): Promise<Court> {
    return this.courtsService.create(createCourtDto);
  }

  @Get()
  findAll(): Promise<Court[]> {
    return this.courtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Court> {
    return this.courtsService.findOne(+id);
  }

  @Patch(':id/availability')
  updateAvailability(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ): Promise<Court> {
    return this.courtsService.updateAvailability(+id, isAvailable);
  }
}
