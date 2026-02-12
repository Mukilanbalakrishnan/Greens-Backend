// src/models/Project.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from "sequelize-typescript";
import { ProjectTech } from "./ProjectTech.model";

@Table({ tableName: "projects" })
export class Project extends Model {
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

  @Column(DataType.STRING)
  imageUrl!: string;   // ✅ THIS MUST EXIST IN DB

  @Column({ defaultValue: 0 })
  order!: number;
  
  @Column({ 
    type: DataType.STRING, 
    allowNull: true 
  })
  projectLink?: string;
  @Column({ defaultValue: true })
  isActive!: boolean;

  @HasMany(() => ProjectTech)
  tech!: ProjectTech[];
}
