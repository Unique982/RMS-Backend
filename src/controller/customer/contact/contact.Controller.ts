import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
import { QueryTypes } from "sequelize";
class ContactUs {
  static async sendMsg(req: IExtendedRequest, res: Response) {
    const { username, phoneNumber, email, message } = req.body;
    if (!username || !phoneNumber || !email || !message)
      return res.status(400).json({ message: "All fields are required" });
    const dateValid = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMsg: any = await sequelize.query(
      `SELECT id FROM contact_us WHERE createdAt >= ?
      LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: [dateValid],
      }
    );

    if (recentMsg && recentMsg.length > 0)
      return res
        .status(400)
        .json({ message: "You can send only one message within 24 hours" });
    await sequelize.query(
      `
      INSERT INTO contact_us ( username,email, phoneNumber,  message, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `,
      {
        type: QueryTypes.INSERT,
        replacements: [username, email, phoneNumber, message],
      }
    );

    return res.status(200).json({ message: "Message sent successfully" });
  }
}
export default ContactUs;
