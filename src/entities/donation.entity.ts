import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  donorName: string;

  @Column({ length: 20, default: 'individual' })
  donorType: 'individual' | 'organization';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @CreateDateColumn()
  donationDate: Date;

  @Column({ length: 20, default: 'money' })
  donationType: 'money' | 'goods';

  @Column({ length: 100, nullable: true })
  purpose: string;

  @Column({ length: 20, default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled';

  @Column({ length: 50, nullable: true })
  paymentMethod: string;

  @Column({ length: 100, nullable: true })
  transactionId: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'boolean', default: false })
  receiptIssued: boolean;

  @Column({ type: 'json', nullable: true })
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    estimatedValue: number;
  }>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalValue: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
