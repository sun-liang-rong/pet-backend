import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('volunteers')
export class Volunteer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100 })
  email: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ length: 100, nullable: true })
  occupation: string;

  @Column({ length: 255, nullable: true })
  experience: string;

  @Column({ length: 100, nullable: true })
  availableTime: string;

  @Column({ length: 20, default: 'active' })
  status: 'active' | 'inactive';

  @Column({ type: 'date' })
  joinDate: Date;

  @Column({ type: 'int', default: 0 })
  activitiesParticipated: number;

  @Column({ type: 'int', default: 0 })
  totalHours: number;

  @Column({ type: 'json', nullable: true })
  skills: string[];

  @Column({ length: 255, nullable: true })
  avatar: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
