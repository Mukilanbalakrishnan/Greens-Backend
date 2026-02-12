import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "heroes" })
export class Hero extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  // 0 = landing
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  domainId!: number;

  // 0 = domain / landing
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  courseId!: number;

  @Column({ allowNull: false })
  title!: string;

  @Column({ allowNull: false })
  subtitle!: string;

  @Column({ type: DataType.TEXT })
  description!: string;


  @Column({ type: DataType.JSON })
  images!: string[]; // slider images

  // 🔥 NEW: RUNNING TEXT (MARQUEE)
  @Column({ type: DataType.JSON })
  runningTexts!: {
    text: string;
  }[];

  @Column({ defaultValue: true })
  isActive!: boolean;
}
