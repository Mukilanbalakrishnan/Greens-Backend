import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "domains" })
export class Domain extends Model {

  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  domainId!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  courseId!: number;

  @Column({ allowNull: false })
  domain!: string;

  @Column({ allowNull: false })
  title!: string;

  @Column({ allowNull: false })
  subtitle!: string;

  @Column({ allowNull: false })
  price!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  /* 🎥 VIDEO */
  @Column({ allowNull: false })
  videoUrl!: string;

  /* 🖼️ THUMBNAIL */
  @Column({ allowNull: false })
  thumbnailUrl!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}

