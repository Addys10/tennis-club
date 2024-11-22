import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  // Trenérská rozšíření
  @Column('simple-array', { nullable: true })
  specialization: string[];

  @Column('simple-array', { nullable: true })
  qualifications: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate: number;

  @Column('json', { nullable: true })
  availability: any;

  @Column({ nullable: true })
  maximumStudents: number;

  @Column({ default: true })
  isActive: boolean;

  // Reset hesla
  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  // Bezpečnost
  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ nullable: true })
  lockoutUntil: Date;
}
