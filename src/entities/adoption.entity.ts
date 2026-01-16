import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('adoptions')
export class Adoption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @Column({ length: 100 })
  petName: string;

  @Column({ length: 100 })
  applicantName: string;

  @Column({ length: 20 })
  applicantPhone: string;

  @Column({ length: 100 })
  applicantEmail: string;

  @Column({ length: 20 })
  applicantIdCard: string;

  @Column({ type: 'text' })
  applicantAddress: string;

  @CreateDateColumn()
  applicationDate: Date;

  @Column({ length: 20, default: 'pending' })
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';

  @Column({ type: 'datetime', nullable: true })
  approvalDate: Date;

  @Column({ length: 50, nullable: true })
  approver: string;

  @Column({ type: 'datetime', nullable: true })
  rejectionDate: Date;

  @Column({ length: 50, nullable: true })
  rejecter: string;

  @Column({ type: 'text', nullable: true })
  rejectReason: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ length: 100, nullable: true })
  experience: string;

  @Column({ length: 50, nullable: true })
  housingType: string;

  @Column({ type: 'boolean', default: false })
  hasYard: boolean;

  @Column({ type: 'int', nullable: true })
  familyMembers: number;

  @Column({ length: 50, nullable: true })
  workHours: string;

  @Column({ type: 'json', nullable: true })
  reviewNotes: Array<{
    date: string;
    content: string;
    operator: string;
  }>;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
