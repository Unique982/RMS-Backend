import { Request, Response } from "express";

import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { getIO } from "../../../../server";

class Menu {
  // Create new menuItems
  static async createMenuItems(req: IExtendedRequest, res: Response) {
    const {
      name,
      price,
      category_id,
      description,
      image_url,
      ingredients,
      availability,
      type,
    } = req.body;
    console.log(req.body);

    if (
      !name ||
      !price ||
      !category_id ||
      !description ||
      !ingredients ||
      !availability ||
      !type
    ) {
      return res.status(400).json({ message: "All fields required!" });
    }

    // Check duplicate dish
    const exists = await sequelize.query(
      `SELECT * FROM menu_items WHERE name=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [name],
      }
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "Menu Items already exists!" });
    }

    // Insert query
    const [result]: any = await sequelize.query(
      `INSERT INTO menu_items(name,description,price,category_id,image_url, ingredients,availability,type,created_at,updated_at)
         VALUES (?,?,?,?,?,?,?,?,NOW(),NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: [
          name,
          description,
          price,
          category_id,
          image_url || null,
          ingredients,
          availability,
          type,
        ],
      }
    );
    getIO().emit("menuAdded", {
      id: result,
      name,
      description,
      price,
      category_id,
      image_url,
      ingredients,
      availability,
      type,
    });

    res.status(201).json({ message: "Menu Items added successfully!" });
  }

  // Get all menuItems
  static async getMenuItems(req: IExtendedRequest, res: Response) {
    const menuData = await sequelize.query(
      `SELECT m.*, c.categoryName FROM menu_items m JOIN category c ON m.category_id = c.id`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({ message: "Fectch successfully", data: menuData });
  }

  // Get single menuItems
  static async singleMenuItems(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const existsId = await sequelize.query(
      `SELECT * FROM menu_items WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (existsId.length === 0) {
      res.status(400).json({ message: "Menu Itmes id not found!" });
    } else {
      res
        .status(200)
        .json({ message: "Fetch menuItmes single!", data: existsId });
    }
  }

  // Update dish
  static async editMenuItems(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const {
      name,
      price,
      category_id,
      description,
      image_url,
      ingredients,
      availability,
      type,
    } = req.body;

    if (
      !name ||
      !price ||
      !category_id ||
      !description ||
      !ingredients ||
      !availability ||
      !type
    ) {
      return res.status(400).json({ message: "All fields required!" });
    }

    // Check duplicate dish
    const exists = await sequelize.query(
      `SELECT * FROM menu_items WHERE name=? AND id!=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [name, id],
      }
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "Menu Items already exists!" });
    }

    await sequelize.query(
      `UPDATE menu_items
         SET name=?,description=?,price=?, category_id=?, image_url=?,ingredients=?,availability=?,type=?, updated_at=NOW()
         WHERE id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [
          name,
          description,
          price,
          category_id,
          image_url || null,
          ingredients,
          availability,
          type,
          id,
        ],
      }
    );
    getIO().emit("menuUpdated", {
      id: Number(id),
      name,
      description,
      price,
      category_id,
      image_url,
      ingredients,
      availability,
      type,
    });

    res.status(200).json({ message: "Menu items updated successfully!" });
  }

  // Delete dish
  static async deleteMenuItems(req: IExtendedRequest, res: Response) {
    const { id } = req.params;

    const exists = await sequelize.query(
      `SELECT id FROM menu_items WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );

    if (exists.length === 0) {
      return res.status(404).json({ message: "menu items not found!" });
    }

    await sequelize.query(`DELETE FROM menu_items WHERE id=?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });
    getIO().emit("menuDeleted", Number(id));

    res.status(200).json({ message: "Menu Items deleted successfully!" });
  }
}

export default Menu;
