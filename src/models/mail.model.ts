// import { Table, Column, Model, DataType } from "sequelize-typescript";

// @Table({
//   tableName: "mail",
//   timestamps: true,
// })
// export class Contact extends Model {
//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//     validate: { isEmail: true },
//   })
//   email!: string;

//   @Column({
//     type: DataType.STRING,
//     field: "user_name",
//   })
//   fullName!: string;

//   @Column({
//     type: DataType.STRING,
//   })
//   phone!: string;

//   /**
//    * Values:
//    * - GENERAL
//    * - Full Stack Development
//    * - UI UX Design
//    */
//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//     field: "contact_type",
//   })
//   contactType!: string;

//   @Column({
//     type: DataType.INTEGER,
//     defaultValue: 0,
//     field: "domain_id",
//   })
//   domainId!: number;

//   @Column({
//     type: DataType.INTEGER,
//     defaultValue: 0,
//     field: "course_id",
//   })
//   courseId!: number;
// }


import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "mail",
  timestamps: true,
})
export class Contact extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id!: number;

@Column({
  type: DataType.STRING,
  allowNull: false,
  validate: { isEmail: true },
})
email!: string;

  // 🔥 CHANGE fullName → name
  @Column({
    type: DataType.STRING,
    field: "user_name",
  })
  name!: string;

  @Column(DataType.STRING)
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "contact_type",
  })
  contactType!: string;

  @Column({ type: DataType.INTEGER, field: "domain_id" })
  domainId!: number;

  @Column({ type: DataType.INTEGER, field: "course_id" })
  courseId!: number;
}
