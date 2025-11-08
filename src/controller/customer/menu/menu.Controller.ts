import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";

class ViewMenu {
  static async viewmenu(req: IExtendedRequest, res: Response) {
    const menuData = await sequelize.query(`SELECT * FROM menu_items`, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({ message: "Menu fetch!", data: menuData });
  }
}
export default ViewMenu;
