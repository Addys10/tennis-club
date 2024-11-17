import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surface: string;

  @Column({ default: true })
  isAvailable: boolean;
}
