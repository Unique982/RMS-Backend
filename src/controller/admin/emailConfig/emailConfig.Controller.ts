// email configure code here
// controller/admin/emailConfigure

import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";

export const emailConfigure = async () => {
  const emailConfigData: any[] = await sequelize.query(
    `SELECT emailSenderName, smtpHost, smtpPort, smtpUsername, smtpPassword, smtpEncryption FROM setting LIMIT 1`,
    {
      type: QueryTypes.SELECT,
    }
  );
  if (emailConfigData.length === 0) return null;
  return emailConfigData[0];
};
console.log(emailConfigure);
