import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
import bcrypt from "bcrypt";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
class PasswordReset {
  static async passwordReset(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword)
      return res.status(400).json({ message: "Provide all fileds" });
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sequelize.query(`UPDATE users SET password = ? WHERE id = ?`, {
      replacements: [hashedPassword, userId],
      type: QueryTypes.UPDATE,
    });

    return res.status(200).json({ message: "Password updated successfully" });
  }
}
export default PasswordReset;
