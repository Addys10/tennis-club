import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from '../../entities/court.entity';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@Injectable()
export class CourtsService {
  constructor(
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
  ) {}

  findAll() {
    return this.courtsRepository.find();
  }

  async findOne(id: number) {
    const court = await this.courtsRepository.findOne({ where: { id } });
    if (!court) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }
    return court;
  }

  create(createCourtDto: CreateCourtDto) {
    const court = this.courtsRepository.create(createCourtDto);
    return this.courtsRepository.save(court);
  }

  async update(id: number, updateCourtDto: UpdateCourtDto) {
    const court = await this.findOne(id);
    Object.assign(court, updateCourtDto);
    return this.courtsRepository.save(court);
  }
}
