import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import { userRole } from "../../middleware/types/type";

// column fileds
// id, userName,email,password,role->enum('customer','admin'), facebook and google login

@Table({
  tableName: "users",
  timestamps: true,
  modelName: "User",
})
class User extends Model {
  // id col
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  // userName
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare username: string;

  // email
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  // password
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare password: string;

  // user role
  @Column({
    type: DataType.ENUM("customer", "admin"),
    defaultValue: "customer",
  })
  declare role: userRole;

  // google login
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare google_id: string;

  // facebook
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare facebook_id: string;

  //otp
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare otp: number;
  // otp exp
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare otp_exp: Date;
}

export default User;
