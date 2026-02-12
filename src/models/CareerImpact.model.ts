import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "career_impacts" })
export class CareerImpact extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  // 0 = landing
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  domainId!: number;

  // 0 = domain-level
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  courseId!: number;

  /* LEFT MAIN CARD */
  @Column({ allowNull: false })
  mainTitle!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  mainDescription!: string;

  @Column({ allowNull: false })
  ctaText!: string;

  @Column({ allowNull: false })
  ctaLink!: string;

  /* RIGHT CARD 1 */
  @Column({ allowNull: false })
  card1Title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  card1Description!: string;

  /* RIGHT CARD 2 */
  @Column({ allowNull: false })
  card2Title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  card2Description!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
