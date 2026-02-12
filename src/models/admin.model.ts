// admin.model.ts

import { Table, Column, Model, DataType, IsEmail, Unique } from 'sequelize-typescript';

interface AdminAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
}

@Table({
  tableName: 'admins',
  timestamps: true,
})
// CHANGE THIS LINE: Pass AdminAttributes instead of Admin
export class Admin extends Model<AdminAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  username!: string;

  @Unique
  @IsEmail
  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;
}