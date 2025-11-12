import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
import { QueryTypes } from "sequelize";
class AdminDashboardOverView {
  // get all user
  static async getAllUser(req: IExtendedRequest, res: Response) {
    const countOrder: any = await sequelize.query(
      `SELECT COUNT(*) AS totalOrder FROM orders`,
      { type: QueryTypes.SELECT }
    );

    const countPending: any = await sequelize.query(
      `SELECT COUNT(*) AS pendingOrder FROM orders WHERE status = 'pending'`,
      { type: QueryTypes.SELECT }
    );

    const countActive: any = await sequelize.query(
      `SELECT COUNT(*) AS activeOrder FROM orders WHERE status = 'confirmed' OR status = 'preparing' OR status = 'ready'`,
      { type: QueryTypes.SELECT }
    );

    const countCancelled: any = await sequelize.query(
      `SELECT COUNT(*) AS cancelledOrder FROM orders WHERE status = 'cancelled'`,
      { type: QueryTypes.SELECT }
    );

    const countTables: any = await sequelize.query(
      `SELECT COUNT(*) AS totalTable FROM tables`,
      { type: QueryTypes.SELECT }
    );

    const countInquiries: any = await sequelize.query(
      `SELECT COUNT(*) AS totalInquiry FROM contact_us`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({
      success: true,
      data: {
        totalOrder: countOrder[0].totalOrder,
        pendingOrder: countPending[0].pendingOrder,
        activeOrder: countActive[0].activeOrder,
        cancelledOrder: countCancelled[0].cancelledOrder,
        totalTable: countTables[0].totalTable,
        totalInquiry: countInquiries[0].totalInquiry,
      },
    });
    // get all pending order

    // get all active order
    // get order cancell
    // bookin table count
    // inquery message
    //
  }
}
export default AdminDashboardOverView;
