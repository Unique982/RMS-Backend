import {
  AutoIncrement,
  Column,
  PrimaryKey,
  Table,
  DataType,
  Model,
} from "sequelize-typescript";

@Table({
  tableName: "setting",
  timestamps: true,
  modelName: "Setting",
})
class Setting extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  // --- System Settings ---
  @Column({ type: DataType.STRING })
  declare restaurantName: string;

  @Column({ type: DataType.STRING })
  declare logo: string;

  @Column({ type: DataType.STRING })
  declare address: string;

  @Column({ type: DataType.STRING })
  declare contactNumber: string;

  @Column({ type: DataType.TIME })
  declare openingTime: string;

  @Column({ type: DataType.TIME })
  declare closingTime: string;

  @Column({ type: DataType.STRING })
  declare timezone: string;

  @Column({ type: DataType.STRING })
  declare websiteUrl: string;

  @Column({ type: DataType.STRING })
  declare facebookUrl: string;

  @Column({ type: DataType.STRING })
  declare instagramUrl: string;

  @Column({ type: DataType.STRING })
  declare tiktokUrl: string;

  @Column({ type: DataType.STRING })
  declare youtubeUrl: string;

  // --- Email Settings ---
  @Column({ type: DataType.STRING })
  declare emailSenderName: string;

  @Column({ type: DataType.STRING })
  declare smtpHost: string;

  @Column({ type: DataType.INTEGER })
  declare smtpPort: number;

  @Column({ type: DataType.STRING })
  declare smtpUsername: string;

  @Column({ type: DataType.STRING })
  declare smtpPassword: string;

  @Column({ type: DataType.STRING })
  declare smtpEncryption: string;

  // --- Advanced Settings ---
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare clearCache: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare backupRestore: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare auditLogs: string;
}

export default Setting;
