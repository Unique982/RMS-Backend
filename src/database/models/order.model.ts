import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Default,
} from "sequelize-typescript";
import User from "./users.model";
import Tables from "./table.model";

export type OrderType = "dine-in" | "takeaway" | "delivery";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";
export type PaymentMethod = "cash" | "esewa" | "khalti";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
class Order extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare user_id: number;

  @ForeignKey(() => Tables)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare table_id: number;

  @Column({
    type: DataType.ENUM("dine-in", "takeaway", "delivery"),
    allowNull: false,
    defaultValue: "dine-in",
  })
  declare order_type: OrderType;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare total_amount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.0,
  })
  declare discount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare final_amount: number;

  @Column({
    type: DataType.ENUM(
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "cancelled"
    ),
    defaultValue: "pending",
  })
  declare status: OrderStatus;

  @Column({
    type: DataType.ENUM("unpaid", "paid", "refunded"),
    defaultValue: "unpaid",
  })
  declare payment_status: PaymentStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare special_request: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare delivery_address: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deleted_at: Date | null;
}

export default Order;
