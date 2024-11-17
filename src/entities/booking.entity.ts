import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Court } from './court.entity';
import { User } from './user.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Court)
  court: Court;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: 'pending' })
  status: string;
}
