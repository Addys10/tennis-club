import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserRole } from '../../enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user;
  }

  async setPasswordResetToken(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await this.usersRepository.save(user);

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: {
        resetPasswordExpires: MoreThanOrEqual(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValidToken) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.usersRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findAllCoaches(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: UserRole.COACH, isActive: true },
    });
  }

  async updateCoachAvailability(id: number, availability: any): Promise<User> {
    const coach = await this.findOne(id);
    if (!coach || coach.role !== UserRole.COACH) {
      throw new NotFoundException('Coach not found');
    }

    coach.availability = availability;
    return this.usersRepository.save(coach);
  }

  async updateCoachSpecialization(
    id: number,
    specialization: string[],
  ): Promise<User> {
    const coach = await this.findOne(id);
    if (!coach || coach.role !== UserRole.COACH) {
      throw new NotFoundException('Coach not found');
    }

    coach.specialization = specialization;
    return this.usersRepository.save(coach);
  }

  async getCoachStudentsCount(id: number): Promise<number> {
    const coach = await this.findOne(id);
    if (!coach || coach.role !== UserRole.COACH) {
      throw new NotFoundException('Coach not found');
    }
    // Toto budeme implementovat později až budeme mít vazbu na tréninky
    return 0;
  }
}
