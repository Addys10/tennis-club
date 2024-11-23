import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class AdminSeedService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async seed() {
    const adminExists = await this.usersRepository.findOne({
      where: { email: 'admin@admin.com' },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const admin = this.usersRepository.create({
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      });

      await this.usersRepository.save(admin);
      console.log('Admin user created');
    }
  }
}
