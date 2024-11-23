import {
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminSeedService } from './create-admin.seed';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';

@Controller('seed')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeedController {
  constructor(private readonly adminSeedService: AdminSeedService) {}

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async seedAdmin() {
    if (process.env.NODE_ENV !== 'production') {
      await this.adminSeedService.seed();
      return { message: 'Admin seeded successfully' };
    }
    throw new ForbiddenException('Not allowed in production');
  }
}
