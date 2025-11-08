import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";

class ViewCategory {
  static async getCategory(req: IExtendedRequest, res: Response) {
    const categoryData = await sequelize.query(`SELECT * FROM category`, {
      type: QueryTypes.SELECT,
    });
    if (categoryData.length === 0)
      return res.status(4).json({ message: "No category data" });
    res.status(200).json({ message: "fetch category", data: categoryData });
  }
}
export default ViewCategory;
