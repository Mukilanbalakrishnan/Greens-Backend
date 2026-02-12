import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "courses" })
export class Course extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  // 🔥 Domain Mapping
  @Column({ type: DataType.INTEGER, allowNull: false })
  domainId!: number; // 0 = landing, 1 = DevOps, 2 = AI, etc.
@Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  courseId!: number;
  @Column({ allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ allowNull: false })
  image!: string;

  @Column({ allowNull: false })
  price!: string;

  @Column({ allowNull: false })
  duration!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
