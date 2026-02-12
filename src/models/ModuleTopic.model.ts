// // src/models/ModuleTopic.model.ts
// import {
//   Table,
//   Column,
//   Model,
//   ForeignKey,
// } from "sequelize-typescript";
// import { Module } from "./Module.model";

// @Table({ tableName: "module_topics" })
// export class ModuleTopic extends Model {
//   @Column({ primaryKey: true, autoIncrement: true })
//   id!: number;

//   @ForeignKey(() => Module)
//   @Column
//   moduleId!: number;

//   @Column
//   title!: string;

//   @Column({ defaultValue: true })
//   isActive!: boolean;
// }

import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import { Module } from "./Module.model";

@Table({ tableName: "module_topics" })
export class ModuleTopic extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Module)
  @Column
  moduleId!: number;

  @Column
  title!: string;

  // Added missing column
  @Column(DataType.TEXT)
  description!: string;

  // Added missing column
  @Column({ defaultValue: 0 })
  order!: number;

  @Column({ defaultValue: true })
  isActive!: boolean;

  // Added association for the Admin "Include" query
  @BelongsTo(() => Module)
  module!: Module;
}