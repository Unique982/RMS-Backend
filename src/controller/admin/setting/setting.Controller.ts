import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";

class Setting {
  static async systemSetting(req: IExtendedRequest, res: Response) {
    const {
      restaurantName,
      address,
      contactNumber,
      openingTime,
      closingTime,
      timezone,
      websiteUrl,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
      youtubeUrl,
      emailSenderName,
      smtpHost,
      smtpPort,
      smtpUsername,
      smtpPassword,
      smtpEncryption,
    } = req.body;
    console.log(req.body);

    const exists: any[] = await sequelize.query(
      `SELECT * FROM setting LIMIT 1`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (exists.length > 0) {
      const settingId = exists[0].id;

      // exits id ko data lai update garnu paro
      await sequelize.query(
        `UPDATE setting SET restaurantName=?, address=?,
        contactNumber=?,openingTime=?,closingTime=?,timezone=?,websiteUrl=?,facebookUrl=?,instagramUrl=?,tiktokUrl=?,youtubeUrl=?,emailSenderName=?,smtpHost=?,smtpPort=?,smtpUsername=?,smtpPassword=?,smtpEncryption=?,
        updatedAt=NOW() 
WHERE id=?`,
        {
          type: QueryTypes.UPDATE,
          replacements: [
            restaurantName,
            address,
            contactNumber,
            openingTime,
            closingTime,
            timezone,
            websiteUrl,
            facebookUrl,
            instagramUrl,
            tiktokUrl,
            youtubeUrl,
            emailSenderName,
            smtpHost,
            smtpPort,
            smtpUsername,
            smtpPassword,
            smtpEncryption,
            settingId,
          ],
        }
      );
      return res
        .status(200)
        .json({ message: "setting system updated successfully!" });
    } else {
      await sequelize.query(
        `INSERT INTO setting
  (restaurantName, address, contactNumber, openingTime, closingTime, timezone, websiteUrl, facebookUrl, instagramUrl, tiktokUrl, youtubeUrl,
   emailSenderName, smtpHost, smtpPort, smtpUsername, smtpPassword, smtpEncryption,
   createdAt, updatedAt)
VALUES
  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
   ?, ?, ?, ?,  ?,
   NOW(), NOW())
`,
        {
          replacements: [
            restaurantName,

            address,
            contactNumber,
            openingTime,
            closingTime,
            timezone,
            websiteUrl,
            facebookUrl,
            instagramUrl,
            tiktokUrl,
            youtubeUrl,
            emailSenderName,
            smtpHost,
            smtpPort,
            smtpUsername,
            smtpPassword,
            smtpEncryption,
          ],
          type: QueryTypes.INSERT,
        }
      );
      res
        .status(200)
        .json({ message: "setting system created  successfully " });
    }
  }
  // get setting
  static async getSetting(req: IExtendedRequest, res: Response) {
    const getSetting = await sequelize.query(`SELECT * FROM setting`, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({ message: "Fetch Setting!", data: getSetting });
  }
}

export default Setting;
