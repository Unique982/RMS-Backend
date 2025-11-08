import {
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
} from "sequelize-typescript";

@Table({
  tableName: "about",
  timestamps: true,
  modelName: "About",
})
class About extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  // about heading title
  @Column({
    type: DataType.STRING,
  })
  declare aboutTitle: string;

  // about description
  @Column({
    type: DataType.TEXT,
  })
  declare aboutDescription: string;

  // about img
  @Column({
    type: DataType.STRING,
  })
  declare aboutImage: string;
}

export default About;
