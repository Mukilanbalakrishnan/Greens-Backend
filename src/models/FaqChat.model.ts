import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "faq_chats" })
export class FAQChat extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  step!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  question!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  answer!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
