import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Model,
} from "sequelize-typescript";

@Table({
  tableName: "tables",
  timestamps: true,
  modelName: "Tables",
})
class Tables extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  // table number
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare tableNumber: string;

  // table seat
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare seats: number;

  //isAvailable!
  @Column({
    type: DataType.ENUM("available", "unavailable"),
    defaultValue: "available",
    allowNull: false,
  })
  declare tableStatus: string;
}
export default Tables;
