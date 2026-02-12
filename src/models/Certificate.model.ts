import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "certificates" })
export class Certificate extends Model {
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

  /* SECTION HEADER */
  @Column({ allowNull: false })
  sectionTitle!: string;

  /* STEPS ARRAY */
  @Column({ type: DataType.JSON, allowNull: false })
  steps!: {
    id: number;
    title: string;
    description: string;
    icon: string;
  }[];

  /* CERTIFICATE IMAGE */
  @Column({ allowNull: false })
  certificateImage!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
