import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";

class MyCart {
  static async createCart(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id || null;
    const { menu_item_id, quantity } = req.body;
    if (!quantity || !menu_item_id) {
      return res
        .status(400)
        .json({ message: "Please provide quantity and product" });
    }
    // check ifmenu item exits or not
    const menuItems = await sequelize.query(
      `SELECT id FROM menu_items WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [menu_item_id],
      }
    );
    if (!menuItems || menuItems.length === 0) {
      return res.status(404).json({ message: "Menu Items not found!" });
    }
    // check if user alerdy cart or not
    const [cart]: any = await sequelize.query(
      `SELECT id  FROM carts WHERE user_id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [userId],
      }
    );
    let cartId: number;
    if (userId) {
      if (!cart) {
        const [newCartId] = await sequelize.query(
          `INSERT INTO carts(user_id,createdAt,updatedAt)VALUES(?,NOW(),NOW())`,
          {
            type: QueryTypes.INSERT,
            replacements: [userId],
          }
        );
        cartId = newCartId;
      } else {
        cartId = cart.id;
      }

      //check if same item already exists in cart ma xa vanni update grw
      const existsItems: any = await sequelize.query(
        `SELECT id,quantity FROM cart_items WHERE cart_id =? AND menu_item_id=?`,
        {
          type: QueryTypes.SELECT,
          replacements: [cartId, menu_item_id],
        }
      );
      if (existsItems.length > 0) {
        const item = existsItems[0];
        await sequelize.query(
          `UPDATE cart_items 
   SET quantity = quantity + ?, updatedAt = NOW() 
   WHERE id = ?`,
          {
            type: QueryTypes.UPDATE,
            replacements: [quantity, existsItems[0].id],
          }
        );

        return res.status(200).json({
          message: "Cart Item quantity update successfully",
          cart_id: cartId,
        });
        //insert query
      }
      await sequelize.query(
        `INSERT INTO cart_items(cart_id,menu_item_id,quantity,createdAt,updatedAt)VALUES(?,?,?,NOW(),NOW())`,
        {
          type: QueryTypes.INSERT,
          replacements: [cartId, menu_item_id, quantity],
        }
      );
      const cartData = await sequelize.query(
        `SELECT ci.id as cart_item_id, ci.menu_item_id, ci.quantity, mi.name, mi.price, mi.image_url
   FROM cart_items ci
   JOIN carts c ON ci.cart_id = c.id
   JOIN menu_items mi ON ci.menu_item_id = mi.id
   WHERE c.user_id = ?`,
        {
          type: QueryTypes.SELECT,
          replacements: [userId],
        }
      );
      return res.status(200).json({
        message: "Item added to cart successfully!",
        cartId,
        data: cartData,
      });
    } else {
      // guest user ho vani
      return res.status(200).json({
        message: "Items added to cart successfully!",
        cartItem: { menu_item_id, quantity },
      });
    }
  }
  // get
  static async getCart(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      // guest user
      return res.status(200).json({
        message: "Guest cart",
        data: [],
      });
    }
    const cartData = await sequelize.query(
      `SELECT ci.id as cart_item_id, ci.menu_item_id, ci.quantity, mi.name, mi.price, mi.image_url
     FROM cart_items ci
     JOIN carts c ON ci.cart_id = c.id
     JOIN menu_items mi ON ci.menu_item_id = mi.id
     WHERE c.user_id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [userId],
      }
    );

    res
      .status(200)
      .json({ message: "Cart fetched successfully", data: cartData });
  }

  // delete cart
  static async deleteCart(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const cartId = req.params.id;
    const exitsId = await sequelize.query(
      `SELECT id FROM carts WHERE id =? AND user_id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [cartId, userId],
      }
    );
    if (!exitsId || exitsId.length === 0) {
      return res.status(400).json({ message: "cart id not found" });
    }
    await sequelize.query(`DELETE FROM cart_items WHERE cart_id =?`, {
      type: QueryTypes.DELETE,
      replacements: [cartId],
    });
    await sequelize.query(`DELETE FROM carts WHERE id =? AND user_id=?`, {
      type: QueryTypes.DELETE,
      replacements: [cartId, userId],
    });
    res.status(200).json({ message: "Cart delete successfull" });
  }
  static async mergeGuestCart(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    for (const item of items) {
      const [cart]: any = await sequelize.query(
        `SELECT id FROM carts WHERE user_id = ?`,
        {
          type: QueryTypes.SELECT,
          replacements: [userId],
        }
      );
      let cartId = cart?.id;
      if (!cartId) {
        const [newCartId] = await sequelize.query(
          `INSERT INTO carts(user_id, createdAt, updatedAt) VALUES(?, NOW(), NOW())`,
          { type: QueryTypes.INSERT, replacements: [userId] }
        );
        cartId = newCartId;
      }

      const existsItems: any = await sequelize.query(
        `SELECT id FROM cart_items WHERE cart_id=? AND menu_item_id=?`,
        { type: QueryTypes.SELECT, replacements: [cartId, item.menu_item_id] }
      );

      if (existsItems.length > 0) {
        await sequelize.query(
          `UPDATE cart_items SET quantity = quantity + ? WHERE id=?`,
          {
            type: QueryTypes.UPDATE,
            replacements: [item.quantity, existsItems[0].id],
          }
        );
      } else {
        await sequelize.query(
          `INSERT INTO cart_items(cart_id, menu_item_id, quantity, createdAt, updatedAt) VALUES(?,?,?,NOW(),NOW())`,
          {
            type: QueryTypes.INSERT,
            replacements: [cartId, item.menu_item_id, item.quantity],
          }
        );
      }
    }

    const cartData = await sequelize.query(
      `SELECT ci.id as cart_item_id, ci.menu_item_id, ci.quantity, mi.name, mi.price, mi.image_url
     FROM cart_items ci
     JOIN carts c ON ci.cart_id=c.id
     JOIN menu_items mi ON ci.menu_item_id=mi.id
     WHERE c.user_id=?`,
      { type: QueryTypes.SELECT, replacements: [userId] }
    );

    localStorage.removeItem("guest_cart");

    res.status(200).json({ message: "Guest cart merged", data: cartData });
  }
}

export default MyCart;
