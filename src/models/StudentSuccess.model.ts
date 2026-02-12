import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "student_success" })
export class StudentSuccess extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ defaultValue: 0 })
  domainId!: number;

  @Column({ defaultValue: 0 })
  courseId!: number;

  @Column({ allowNull: false })
  name!: string;

  @Column({ allowNull: false })
  course!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  rating!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  review!: string;

  @Column
  placement!: string;

  @Column
  duration!: string;

  // 🔥 Local image path
  @Column
  image!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
