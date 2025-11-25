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
import Cart from "./cart.model";
import MenuItem from "./menuItem.model";

@Table({
  tableName: "cart_items",
  timestamps: true,
})
class CartItem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Cart)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare cart_id: number;

  @ForeignKey(() => MenuItem)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare menu_item_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  declare quantity: number;

  @BelongsTo(() => Cart)
  cart?: Cart;

  @BelongsTo(() => MenuItem)
  menuItem?: MenuItem;
}

export default CartItem;
