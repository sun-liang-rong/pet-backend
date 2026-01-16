import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 领养记录实体
 * 存储已完成领养的信息，包括回访记录
 *
 * 关联关系:
 * - adoptionApplicationId: 关联原始申请ID
 * - petId: 关联宠物ID
 * - adopterId: 关联用户ID
 */
@Entity('adoption_records')
export class AdoptionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 关联的领养申请ID
   * 可选，用于追溯原始申请记录
   */
  @Column({ type: 'int', nullable: true })
  adoptionApplicationId: number;

  /**
   * 领养记录编号 (格式: AR-YYYY-XXXXXX)
   */
  @Column({ length: 50, unique: true })
  recordNumber: string;

  /**
   * 宠物ID
   */
  @Column({ type: 'int' })
  petId: number;

  /**
   * 宠物名称 (冗余存储，便于查询)
   */
  @Column({ length: 100 })
  petName: string;

  /**
   * 宠物品种
   */
  @Column({ length: 100, nullable: true })
  petBreed: string;

  /**
   * 宠物图片URL (冗余存储)
   */
  @Column({ type: 'text', nullable: true })
  petImage: string;

  /**
   * 领养人ID
   */
  @Column({ type: 'int' })
  adopterId: number;

  /**
   * 领养人姓名
   */
  @Column({ length: 100 })
  adopterName: string;

  /**
   * 领养人联系电话
   */
  @Column({ length: 20, nullable: true })
  adopterPhone: string;

  /**
   * 领养人邮箱
   */
  @Column({ length: 100, nullable: true })
  adopterEmail: string;

  /**
   * 领养人地址
   */
  @Column({ type: 'text', nullable: true })
  adopterAddress: string;

  /**
   * 领养完成日期
   */
  @Column({ type: 'date' })
  adoptionDate: Date;

  /**
   * 协议编号
   */
  @Column({ length: 100, nullable: true })
  agreementNumber: string;

  /**
   * 领养状态: active(进行中)/completed(已完成)/cancelled(已取消)
   */
  @Column({ length: 20, default: 'active' })
  status: 'active' | 'completed' | 'cancelled';

  /**
   * 回访记录 (JSON格式存储多条回访记录)
   */
  @Column({ type: 'json', nullable: true })
  followUps: Array<{
    id: string;
    date: string;
    content: string;
    operator: string;
    nextFollowUpDate?: string;
  }>;

  /**
   * 最近一次回访日期
   */
  @Column({ type: 'date', nullable: true })
  lastFollowUpDate: Date;

  /**
   * 下次计划回访日期
   */
  @Column({ type: 'date', nullable: true })
  nextFollowUpDate: Date | null;

  /**
   * 备注
   */
  @Column({ type: 'text', nullable: true })
  remarks: string;

  /**
   * 创建人
   */
  @Column({ length: 50, nullable: true })
  createdBy: string;

  /**
   * 最后更新人
   */
  @Column({ length: 50, nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
