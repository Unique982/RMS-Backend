import { getIO } from "../../../../server";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
import { QueryTypes } from "sequelize";
class Tables {
  static async createTable(req: IExtendedRequest, res: Response) {
    const { tableNumber, seats, tableStatus } = req.body;
    if (!tableNumber || !seats)
      return res.status(400).json({ message: "All filed are required" });

    // check duplicate
    const existsTable = await sequelize.query(
      `SELECT * FROM tables WHERE tableNumber =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [tableNumber],
      }
    );
    if (existsTable.length > 0)
      return res.status(400).json({ message: "Table number already exists!" });

    // insert
    const [result]: any = await sequelize.query(
      `INSERT INTO tables (tableNumber,seats,tableStatus,createdAt,updatedAt) VALUES(?,?,?,NOW(),NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: [tableNumber, seats, tableStatus],
      }
    );
    const tableId = result;
    getIO().emit("tableCreated", {
      table_id: tableId,
      tableNumber,
      seats,
      tableStatus,
    });
    res.status(200).json({ message: "Table saved successfully!" });
  }

  // get table all tables

  static async getTables(req: IExtendedRequest, res: Response) {
    const tablesData = await sequelize.query(`SELECT * FROM tables`, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({ message: "fetch all table!", data: tablesData });
  }

  // delete tables
  static async deleteTable(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const existsTable = await sequelize.query(
      `SELECT id FROM tables WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (existsTable.length === 0)
      return res.status(400).json({ message: "Tables id not found!" });

    //delete
    await sequelize.query(`DELETE FROM tables WHERE id=?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });
    getIO().emit("tableDeleted", { table_id: id });
    res.status(200).json({ message: "Delete table successfullY" });
  }

  // single tbale fetch
  static async singleTables(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const existsTable = await sequelize.query(
      `SELECT id FROM tables WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );

    if (existsTable.length === 0)
      return res.status(400).json({ message: "Table id not found!" });

    // fetch single data
    const tablesData = await sequelize.query(
      `SELECT * FROM tables WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    res.status(200).json({ message: "Single data fetch", data: tablesData });
  }

  // update table
  static async updateTables(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const { tableNumber, seats, tableStatus } = req.body;
    if (!tableNumber || !seats)
      return res.status(400).json({ message: "All filed are required!" });

    const existsTables = await sequelize.query(
      `SELECT * FROM tables WHERE tableNumber =? AND id!=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [tableNumber, id],
      }
    );
    if (existsTables.length > 0)
      return res.status(400).json({ message: "Table number already exists!" });

    const existsTable = await sequelize.query(
      `SELECT id FROM tables WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (existsTable.length === 0)
      return res.status(400).json({ message: "Table id not found!" });

    // update query

    await sequelize.query(
      `UPDATE tables SET tableNumber=?,seats=?,tableStatus=? WHERE id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [tableNumber, seats, tableStatus, id],
      }
    );
    getIO().emit("tableUpdated", {
      table_id: id,
      tableNumber,
      seats,
      tableStatus,
    });
    res.status(200).json({ message: "Update Successfully!" });
  }

  // table status chnage
  static async tableStatusUdapte(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const { tableStatus } = req.body;
    if (!tableStatus)
      return res.status(400).json({ message: "Table status required" });

    const [result] = await sequelize.query(
      `UPDATE tables SET tableStatus=? ,updatedAt=NOW() WHERE id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [tableStatus, id],
      }
    );

    // emit socket event if needed
    getIO().emit("tableUpdated", { order_id: id, tableStatus });

    return res
      .status(200)
      .json({ message: "Table status update successfully!" });
  }
}

export default Tables;
