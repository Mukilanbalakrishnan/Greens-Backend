// src/models/Module.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from "sequelize-typescript";
import { ModuleTopic } from "./ModuleTopic.model";

@Table({ tableName: "modules" })
export class Module extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ allowNull: false })
  domainId!: number;

  @Column({ allowNull: false })
  courseId!: number;

  @Column({ allowNull: false })
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column({ defaultValue: 0 })
  order!: number;

  @Column({ defaultValue: true })
  isActive!: boolean;

  @HasMany(() => ModuleTopic)
  topics!: ModuleTopic[];
}
