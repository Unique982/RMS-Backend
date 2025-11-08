import { Response } from "express";
import { IExtendedRequest } from "../../../middleware/types/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
import { getIO } from "../../../../server";

class Category {
  static async createCategory(req: IExtendedRequest, res: Response) {
    if (req.body === undefined)
      return res.status(400).json({ message: "Enter value!" });

    const { categoryName, categoryDescription } = req.body;
    if (!categoryName || !categoryDescription)
      return res.status(400).json({ message: "All field required!" });

    // check category already xa ki nai
    const exitscategory = await sequelize.query(
      `SELECT * FROM category WHERE categoryName =? AND categoryDescription=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [categoryName, categoryDescription],
      }
    );
    // duplicate xa ki nai check now if duplicate xa vanni  already exists vanrw msg throw grxa if duplicate xaina vani chai next process ma janxa

    if (exitscategory.length > 0)
      return res.status(400).json({ message: "Already exists!" });

    // isnert query
    const [result]: any = await sequelize.query(
      `INSERT INTO category(categoryName,categoryDescription,createdAt,updatedAt)VALUES(?,?,NOW(),NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: [categoryName, categoryDescription],
      }
    );
    // emit socket event
    getIO().emit("categoryAdded", {
      id: result,
      categoryName,
      categoryDescription,
    });

    res
      .status(200)
      .json({ message: "category added successfully!", id: result });
  }

  // get category

  static async getCategory(req: IExtendedRequest, res: Response) {
    const categoryData = await sequelize.query(`SELECT * FROM category`, {
      type: QueryTypes.SELECT,
    });
    // emit socket event
    getIO().emit("categoryGet", {
      categoryData,
    });
    res
      .status(200)
      .json({ message: "Get Category fetch succesfully!", data: categoryData });
  }

  // delete
  static async deleteCategory(req: IExtendedRequest, res: Response) {
    const { id } = req.params;

    // check id category exists or not
    const exists = await sequelize.query(`SELECT id FROM category WHERE id=?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });
    if (exists.length === 0)
      return res.status(400).json({ message: "Category id not found!" });

    // menu ko table bata delete garnu paro
    await sequelize.query(`DELETE FROM menu_items WHERE category_id = ?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });

    //delete
    await sequelize.query(`DELETE FROM category WHERE id=?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });
    // emit delete event
    getIO().emit("categoryDeleted", id);
    res.status(200).json({ message: "delete successfully!" });
  }

  // single category
  static async singleCategory(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const existi = await sequelize.query(
      `SELECT id FROM category WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (existi.length === 0)
      return res.status(400).json({ message: "Catageory id not found" });

    const dataCategory = await sequelize.query(
      `SELECT * FROM category WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    getIO().emit("singleCategoryFetched", dataCategory[0]);
    res
      .status(200)
      .json({ message: "Single category fetch!", data: dataCategory });
  }

  // edit
  static async editCategory(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const { categoryName, categoryDescription } = req.body;
    if (!categoryName || !categoryDescription)
      return res.status(400).json({ message: "All fields require!" });

    const exists = await sequelize.query(`SELECT id FROM category WHERE id=?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });

    if (exists.length === 0)
      return res.status(400).json({ message: "category id not found!" });

    await sequelize.query(
      `UPDATE category SET categoryName=?,categoryDescription=?,updatedAt=NOW() WHERE id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [categoryName, categoryDescription, id],
      }
    );
    getIO().emit("categoryUpdated", { id, categoryName, categoryDescription });

    res.status(200).json({ message: "Update successfully!" });
  }
}
export default Category;
