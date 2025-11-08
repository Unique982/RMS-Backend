import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
import mailSend from "../../../services/mailSend";

class inqueryMsg {
  static async getAllInqueryMsg(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const inqueryMsgData = await sequelize.query(`SELECT * FROM contact_us`, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({ message: "Fetch all data!", data: inqueryMsgData });
  }

  // send reply user or customer
  static async sendReply(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const { id } = req.params;
    const { email, message, subject } = req.body;
    if (!email || !message || !subject || !id)
      return res.status(400).json("All filed required");
    const mailInformation = {
      to: email,
      subject,
      text: message,
      html: `
        <table cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:auto;background-color:#ffffff;border-radius:10px;overflow:hidden;">
          <tr>
            <td style="padding:30px">
              <h2 style="color:#333333;margin-top:0;">Hello ${email}!</h2>
              <p style="font-size:16px;color:#555555;">${message}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f1f1f1;padding:15px;text-align:center;color:#555555;font-size:14px;border-radius:5px;">
              &copy; 2025 The 90's Restaurant & Bar. All rights reserved.<br>
              <a href="https://www.instagram.com/the_90s_restaurant_and_bar/" style="color:#d32f2f;text-decoration:none;">Follow us on Instagram</a>
            </td>
          </tr>
        </table>
      `,
    };

    await mailSend(mailInformation);
    await sequelize.query(
      `UPDATE contact_us SET isReplied = true WHERE id = ?`,
      { replacements: [id], type: QueryTypes.UPDATE }
    );

    res.status(200).json({ message: "Reply sent successfully!" });
  }
}

export default inqueryMsg;
