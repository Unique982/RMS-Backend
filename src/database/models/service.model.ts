import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "service",
  timestamps: true,
  modelName: "Service",
})
class Service extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  // icon
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare serviceIcon: string;

  @Column({
    type: DataType.STRING,
  })
  declare serviceTitle: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare serviceDescription: string;
}

export default Service;
