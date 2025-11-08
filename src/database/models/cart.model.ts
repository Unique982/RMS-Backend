import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import User from "./users.model";

@Table({
  tableName: "carts",
  timestamps: true,
})
class Cart extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare user_id: number;
}

export default Cart;
