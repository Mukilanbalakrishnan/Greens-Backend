import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ 
  tableName: "enroll_cards",
  timestamps: true,
  underscored: false, // CHANGE THIS TO false
})
export class EnrollCard extends Model {
  @Column({ 
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  })
  id!: number;

  @Column({ 
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false
  })
  domainId!: number;

  @Column({ 
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false
  })
  courseId!: number;

  @Column({ 
    type: DataType.STRING(255),
    allowNull: false 
  })
  title!: string;

  @Column({ 
    type: DataType.STRING(500),
    allowNull: false 
  })
  image!: string;

  @Column({ 
    type: DataType.INTEGER,
    defaultValue: 0 
  })
  order!: number;

  @Column({ 
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive!: boolean;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  updatedAt!: Date;
}