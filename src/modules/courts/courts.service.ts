import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from '../../entities/court.entity';
import { CreateCourtDto } from './dto/create-court.dto';

@Injectable()
export class CourtsService {
  constructor(
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
  ) {}

  create(createCourtDto: CreateCourtDto): Promise<Court> {
    const court = this.courtsRepository.create(createCourtDto);
    return this.courtsRepository.save(court);
  }

  findAll(): Promise<Court[]> {
    return this.courtsRepository.find();
  }

  findOne(id: number): Promise<Court> {
    return this.courtsRepository.findOneBy({ id });
  }

  async updateAvailability(id: number, isAvailable: boolean): Promise<Court> {
    await this.courtsRepository.update(id, { isAvailable });
    return this.findOne(id);
  }
}
