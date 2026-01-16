import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rescues')
export class Rescue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @Column({ length: 100 })
  petName: string;

  @Column({ type: 'datetime' })
  rescueDate: Date;

  @Column({ length: 255 })
  rescueLocation: string;

  @Column({ length: 50 })
  rescuer: string;

  @Column({ length: 50 })
  rescueType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 50 })
  healthCondition: string;

  @Column({ length: 255 })
  immediateAction: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ length: 255, nullable: true })
  videoUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
