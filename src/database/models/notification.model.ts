import {
  AutoIncrement,
  DataType,
  Model,
  PrimaryKey,
  Column,
  Table,
  Default,
  ForeignKey,
} from "sequelize-typescript";

import User from "./users.model";

export enum Type {
  Order = "order",
  Payment = "payment",
  General = "General",
}

@Table({
  tableName: "notification",
  timestamps: true,
  modelName: "Notification",
})
class Notification extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @Column({
    type: DataType.ENUM("order", "payment", "general"),
    defaultValue: "general",
  })
  declare type: Type;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare user_id: number | null;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare is_read: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare deleted_at: Date | null;
}

export default Notification;
