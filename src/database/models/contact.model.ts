import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "contact_us",
  timestamps: true,
  modelName: "ContactUs",
})
class ContactUs extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message: string;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isReplied: boolean;
}

export default ContactUs;
