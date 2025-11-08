import {
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
} from "sequelize-typescript";

@Table({
  tableName: "gallery",
  timestamps: true,
  modelName: "Gallery",
})
class Gallery extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING })
  declare address: string;
  @Column({ type: DataType.STRING })
  declare image: string;
}
export default Gallery;
