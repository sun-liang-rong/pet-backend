import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  realName: string;

  @Column({ length: 20, default: 'staff' })
  role: 'admin' | 'staff' | 'volunteer';

  @Column({ length: 255, nullable: true })
  avatar: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @CreateDateColumn()
  createTime: Date;

  @Column({ length: 20, default: 'active' })
  status: 'active' | 'inactive' | 'locked';
}
