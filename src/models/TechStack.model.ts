import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "tech_stacks" })
export class TechStack extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  domainId!: number;

  @Column
  courseId!: number;

  @Column({ allowNull: false })
  name!: string;

  @Column(DataType.STRING)
  iconUrl!: string;

  @Column({ defaultValue: 0 })
  order!: number;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
