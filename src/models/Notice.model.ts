import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../config/database'; 

interface NoticeAttributes {
  id: number;
  content: string;
  isActive: boolean;
}

// id is optional during creation
interface NoticeCreationAttributes extends Optional<NoticeAttributes, 'id'> {}

class Notice extends Model<NoticeAttributes, NoticeCreationAttributes> implements NoticeAttributes {
  public id!: number;
  public content!: string;
  public isActive!: boolean;
}

Notice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'notices',
});

export default Notice;