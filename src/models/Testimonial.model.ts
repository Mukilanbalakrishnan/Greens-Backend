import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "testimonials" })
export class Testimonial extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({ allowNull: false, defaultValue: 0 })
  domainId!: number;
  
   @Column({ allowNull: false, defaultValue: 0 })
 courseId!: number;

  @Column({ allowNull: false })
  name!: string;

  @Column({ allowNull: false })
  batch!: string;

  // 🔥 Local image path (uploads/testimonials/xxx.jpg)
  @Column({ allowNull: false })
  image!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  quote!: string;

  @Column({ allowNull: false })
  videoUrl!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
