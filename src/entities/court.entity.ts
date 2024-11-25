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

  @Column('jsonb', {
    nullable: true, // Důležité - umožní null hodnoty pro existující záznamy
  })
  address: {
    city: string;
    street: string;
    placeNumber: number;
  } | null;
}
