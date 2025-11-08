import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";

class MyDashboardOwerView {
  // get all my order
  static async getMyAllOrder(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const orderData = await sequelize.query(
      `SELECT COUNT(*) AS totalOrders FROM orders WHERE deleted_at IS NULL `,
      {
        type: QueryTypes.SELECT,
        replacements: [userId],
      }
    );
    res.status(200).json({ message: "My order summary!", data: orderData });
  }
  // Cancelled Order list
  static async getPendingMyOrder(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const totalPendingOrder = await sequelize.query(
      `SELECT * FROM orders WHERE status='pending' AND user_id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [userId],
      }
    );
    res
      .status(200)
      .json({ message: "My  Pending order summary!", data: totalPendingOrder });
  }
  // Complete my order list
  static async getCompletedMyOrder(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const totalCompletedMyOrder = await sequelize.query(
      `SELECT * FROM orders WHERE status='ready' AND user_id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [userId],
      }
    );
    res.status(200).json({
      message: "My Completed order summary!",
      data: totalCompletedMyOrder,
    });
  }
  // total point
  static async getUserPoints(req: IExtendedRequest, res: Response) {
    const userID = req.user?.id;
    const [totalOrderRs]: any = await sequelize.query(
      `SELECT  COALESCE(SUM(total_amount), 0) AS total_amount FROM orders WHERE deleted_at IS NULL AND user_id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [userID],
      }
    );
    // 100 = 2 point
    // 200 = 4 point
    const totalPoints = (totalOrderRs.total_amount / 100) * 2;
    res.status(200).json({
      message: "Total Reward Point",
      totalPoints: Math.floor(totalPoints),
    });
  }
  // total payment rs
  static async getMyTotalPayment(req: IExtendedRequest, res: Response) {
    const userID = req.user?.id;
    const [totalPay]: any = await sequelize.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS totalPayment
       FROM orders
       WHERE deleted_at IS NULL AND user_id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [userID],
      }
    );
    res.status(200).json({
      message: "Total Pay",
      totalPayment: Math.floor(totalPay.totalPayment),
    });
  }
}
export default MyDashboardOwerView;
