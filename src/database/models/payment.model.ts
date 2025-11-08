import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import Order from "./order.model";

@Table({
  tableName: "payments",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
  })
  declare pidx: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare orderId: number;
  @Column({
    type: DataType.ENUM("pending", "completed", "failed"),
    defaultValue: "pending",
  })
  declare status: string;

  @Column({
    type: DataType.ENUM("cash", "card", "khalti"),
  })
  declare payment_method: string;
  @Column({
    type: DataType.DECIMAL,
  })
  declare total_amount: number;
}
export default Payment;
