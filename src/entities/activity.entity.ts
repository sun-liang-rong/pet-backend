import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 50 })
  type: 'adoption' | 'volunteer' | 'training' | 'fundraising' | 'education';

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ length: 255 })
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', nullable: true })
  participantLimit: number;

  @Column({ type: 'int', default: 0 })
  participantCount: number;

  @Column({ length: 20, default: 'upcoming' })
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

  @Column({ length: 50 })
  organizer: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
