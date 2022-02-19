import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Ai {
  @PrimaryColumn()
  key: string

  @Column()
  reply: string
}
