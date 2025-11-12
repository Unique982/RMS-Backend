import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";

class MyDashboardOwerView {
  // get all my order
  static async customerDashboardOver(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    // Total Orders
    const [totalOrders]: any = await sequelize.query(
      `SELECT COUNT(*) AS totalOrders FROM orders WHERE deleted_at IS NULL AND user_id = ?`,
      { type: QueryTypes.SELECT, replacements: [userId] }
    );
    // Pending Orders
    const pendingOrders: any = await sequelize.query(
      `SELECT * FROM orders WHERE status='pending' AND user_id = ?`,
      { type: QueryTypes.SELECT, replacements: [userId] }
    );

    // Completed Orders
    const completedOrders: any = await sequelize.query(
      `SELECT * FROM orders WHERE status='completed' AND user_id = ?`,
      { type: QueryTypes.SELECT, replacements: [userId] }
    );

    // Total Points
    const [totalAmount]: any = await sequelize.query(
      `SELECT COALESCE(SUM(total_amount),0) AS total_amount FROM orders WHERE deleted_at IS NULL AND user_id = ?`,
      { type: QueryTypes.SELECT, replacements: [userId] }
    );
    const totalPoints = Math.floor((totalAmount.total_amount / 100) * 2);

    // Total Payment
    const [totalPayment]: any = await sequelize.query(
      `SELECT COALESCE(SUM(total_amount),0) AS totalPayment FROM orders WHERE deleted_at IS NULL AND user_id = ?`,
      { type: QueryTypes.SELECT, replacements: [userId] }
    );
    // Send
    res.status(200).json({
      success: true,
      message: "User Dashboard Summary",
      data: {
        totalOrders: totalOrders.totalOrders,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        totalPoints,
        totalPayment: Math.floor(totalPayment.totalPayment),
      },
    });
  }
}
export default MyDashboardOwerView;
