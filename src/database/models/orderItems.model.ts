import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Order from "./order.model";
import MenuItem from "./menuItem.model";

@Table({
  tableName: "order_items",
  modelName: "OrderItem",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
class OrderItem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare order_id: number;

  @ForeignKey(() => MenuItem)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare menu_item_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;
  // soft delete
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deleted_at: Date | null;
}

export default OrderItem;
