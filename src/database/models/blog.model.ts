import {
  AutoIncrement,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Column,
} from "sequelize-typescript";

@Table({
  tableName: "blog",
  timestamps: true,
  modelName: "Blog",
})
class Blog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare blogTitle: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare blogDescription: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare blogImage: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare blogCategory: string;
}

export default Blog;
