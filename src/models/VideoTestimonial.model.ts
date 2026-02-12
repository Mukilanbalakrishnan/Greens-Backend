import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "video_testimonials" })
export class VideoTestimonial extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  domainId!: number;

  @Column
  courseId!: number;

  @Column
  name!: string;

  @Column
  batch!: string;

  @Column(DataType.TEXT)
  quote!: string;

  @Column
  imageUrl!: string;

  @Column(DataType.TEXT)
  videoUrl!: string;

  @Column({ defaultValue: 0 })
  order!: number;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
