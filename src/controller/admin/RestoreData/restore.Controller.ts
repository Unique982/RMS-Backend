import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
class RestoreData {
  static async restoreData(req: IExtendedRequest, res: Response) {
    const { type, from, to } = req.query;
    if (!type || !from || !to)
      return res.status(400).json({ message: "Type and date range required" });

    let tableName = "";
    switch (type) {
      case "orders":
        tableName = "orders";
        break;
      case "reservations":
        tableName = "reservations";
        break;
      case "payments":
        tableName = "payments";
        break;
      default:
        return res.status(400).json({ message: "Invalid type" });
    }
    const data = await sequelize.query(
      `SELECT * FROM ${tableName} WHERE deleted_at BETWEEN ? AND ? ORDER BY deleted_at DESC`,
      {
        replacements: [from, to],
        type: QueryTypes.SELECT,
      }
    );
    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "No data found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  }
}
export default RestoreData;
