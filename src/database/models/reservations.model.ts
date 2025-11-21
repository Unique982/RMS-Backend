import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import User from "./users.model";
import Tables from "./table.model";

export type ReservationStatus = "pending" | "booking" | "cancelled";

@Table({
  tableName: "reservations",
  timestamps: true,
  modelName: "Reservation",
})
class Reservation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  // Foreign key to User
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare user_id: number;

  @BelongsTo(() => User)
  declare customer: User;

  // Foreign key to Tables
  @ForeignKey(() => Tables)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare table_id: number;

  @BelongsTo(() => Tables)
  declare table: Tables;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare guests: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare reservation_date: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare reservation_time: string;

  @Column({
    type: DataType.ENUM("pending", "booking", "cancelled"),
    defaultValue: "pending",
  })
  declare status: ReservationStatus;
  @Column({
    type: DataType.STRING,
  })
  declare name: string;
  @Column({
    type: DataType.STRING,
  })
  declare phoneNumber: string;
  // specailRequest

  @Column({ type: DataType.STRING, allowNull: false })
  declare specailRequest: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deleted_at: Date | null;
}

export default Reservation;
