import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table({
  tableName: "category",
  timestamps: true,
  modelName: "Category",
})
class Category extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;
  // categoryName
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare categoryName: string;
  // category deescription
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare categoryDescription: string;
}

export default Category;
