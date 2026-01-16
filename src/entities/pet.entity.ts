import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  type: 'dog' | 'cat' | 'rabbit' | 'bird' | 'hamster' | 'other';

  @Column({ length: 50 })
  breed: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  age: number;

  @Column({ length: 10 })
  gender: 'male' | 'female';

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ length: 50, nullable: true })
  color: string;

  @Column({ length: 20, default: 'healthy' })
  healthStatus: 'healthy' | 'treating' | 'recovered' | 'critical';

  @Column({ length: 20, default: 'available' })
  adoptionStatus: 'available' | 'pending' | 'adopted' | 'unavailable';

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  rescueDate: Date;

  @Column({ length: 50, nullable: true })
  rescuer: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  favoriteCount: number;

  @Column({ length: 100, nullable: true })
  adoptedBy: string;

  @Column({ type: 'date', nullable: true })
  adoptedDate: Date;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
