  // src/models/ProjectTech.model.ts
  import {
    Table,
    Column,
    Model,
    ForeignKey,
  } from "sequelize-typescript";
  import { Project } from "./Project.model";

  @Table({ tableName: "project_tech" })
  export class ProjectTech extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;

    @ForeignKey(() => Project)
    @Column
    projectId!: number;

    @Column
    name!: string;

    @Column({ defaultValue: true })
    isActive!: boolean;
  }
