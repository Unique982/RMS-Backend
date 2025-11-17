// controller/notification

import { QueryTypes } from "sequelize";
import sequelize from "../../database/connection";
import { IExtendedRequest } from "../../middleware/types/type";
import { Response } from "express";
import { getIO } from "../../../server";
interface INotification {
  title: string;
  description?: string;
  type?: "order" | "payment" | "general";
  user_role: "admin" | "customer";
  user_id?: number | null;
}
class HelperNotification {
  // create
  static createNotification = async (data: INotification) => {
    const { title, description, type = "general", user_role, user_id } = data;

    const [result]: any = await sequelize.query(
      `INSERT INTO notification(title, description, type, user_role, user_id, is_read,  createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: [title, description, type, user_role, user_id || null],
      }
    );
    console.log("Notification Inserted ID:", result);

    const notification = {
      id: result,
      title,
      description,
      type,
      user_role,
      user_id,
      is_read: false,
      createdAt: new Date(),
    };

    // Emit real-time notification
    if (user_id) {
      getIO().to(`user_${user_id}`).emit("newNotification", notification);
    } else {
      getIO().emit("newNotification", notification);
    }
    return notification;
  };
  // get

  static async getNotication(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const getAllnotification = await sequelize.query(
      `SELECT * FROM notification 
         WHERE deleted_at IS NULL AND user_role = ? 
           AND (user_id = ? OR user_id IS NULL)
         ORDER BY createdAt DESC`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ messgae: "notifaction fetch" });
  }
  // make all read

  static async makeAllRead(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    await sequelize.query(
      `UPDATE notification 
         SET is_read = 1 
         WHERE user_role = ? AND (user_id = ? OR user_id IS NULL) AND deleted_at IS NULL`,
      { type: QueryTypes.UPDATE, replacements: [userRole, userId || null] }
    );
    res.status(200).json({ messgae: "All notifications marked as read" });
  }
}
export default HelperNotification;
