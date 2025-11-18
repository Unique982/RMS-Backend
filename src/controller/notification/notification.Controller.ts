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
  user_id?: number | null;
  is_read?: boolean;
}
class HelperNotification {
  // create
  static createNotification = async (data: INotification) => {
    const { title, description, type = "general", user_id } = data;

    const [result]: any = await sequelize.query(
      `INSERT INTO notification(title, description, type, user_id, is_read,  createdAt, updatedAt)
     VALUES (?, ?, ?, ?, 0, NOW(), NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: [title, description, type, user_id || null],
      }
    );
    console.log("Notification Inserted ID:", result);

    const notification = {
      id: result,
      title,
      description,
      type,
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
    const userRole = req.user?.role; // should be 'customer'
    console.log("user role kun xa", userRole);
    const userId = req.user?.id;

    const result = await sequelize.query(
      `SELECT * FROM notification 
       WHERE deleted_at IS NULL 
       AND (user_id = ? OR user_id IS NULL)
       ORDER BY createdAt DESC`,
      { type: QueryTypes.SELECT, replacements: [userId] }
    );
    // notification formated data
    const formatted = result.map((n: any) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      type: n.type,

      user_id: n.user_id,
      status: n.is_read === 1 ? "read" : "unread",
      created_at: n.createdAt,
    }));
    res.status(200).json({ messgae: "notifaction fetch", data: formatted });
  }
  // make all read

  static async makeAllRead(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    await sequelize.query(
      `UPDATE notification 
     SET is_read = 1 
     WHERE (user_id = ? OR user_id IS NULL) 
       AND deleted_at IS NULL`,
      { type: QueryTypes.UPDATE, replacements: [userId] }
    );
    res.status(200).json({ messgae: "All notifications marked as read" });
  }
}
export default HelperNotification;
