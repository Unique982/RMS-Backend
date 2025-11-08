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
import Category from "./category.model";

export type DishStatus = "available" | "unavailable";
export type DishType = "veg" | "non-veg";

@Table({
  tableName: "menu_items",
  modelName: "MenuItem",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
class MenuItem extends Model {
  // menuItems id
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  // menuItmes name
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  //menuItems description
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  // menuItems price
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  // ✅ Foreign Key to Category
  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare category_id: number;

  @BelongsTo(() => Category)
  declare category: Category;

  // menuItmes  imge_url
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare image_url: string | null;

  // menu short slug = ingredients
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare ingredients: string | null;

  // menuStatus
  @Column({
    type: DataType.ENUM("available", "unavailable"),
    defaultValue: "available",
  })
  declare availability: DishStatus;

  // food types
  @Column({
    type: DataType.ENUM("veg", "non-veg"),
    defaultValue: "veg",
  })
  declare type: DishType;
}

export default MenuItem;
