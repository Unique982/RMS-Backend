import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";

class MyCart {
  static async createCart(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const { menu_item_id, quantity } = req.body;
    if (!menu_item_id || !quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Please provide quantity and product" });
    }

    // Check if menu item exists
    const menuItems = await sequelize.query(
      `SELECT id FROM menu_items WHERE id = ?`,
      { type: QueryTypes.SELECT, replacements: [menu_item_id] }
    );

    if (!menuItems || menuItems.length === 0) {
      return res.status(404).json({ message: "Menu item not found!" });
    }

    // Get or create user's cart
    let cartId: number;
    const [userCart]: any = await sequelize.query(
      `SELECT id FROM carts WHERE user_id = ?`,
      { type: QueryTypes.SELECT, replacements: [userId] }
    );

    if (!userCart) {
      const [newCartId] = await sequelize.query(
        `INSERT INTO carts(user_id, createdAt, updatedAt) VALUES (?, NOW(), NOW())`,
        { type: QueryTypes.INSERT, replacements: [userId] }
      );
      cartId = newCartId;
    } else {
      cartId = userCart.id;
    }

    // Check if item exists in cart
    const existsItems: any = await sequelize.query(
      `SELECT id, quantity FROM cart_items WHERE cart_id = ? AND menu_item_id = ?`,
      { type: QueryTypes.SELECT, replacements: [cartId, menu_item_id] }
    );

    if (existsItems.length > 0) {
      // Update quantity
      await sequelize.query(
        `UPDATE cart_items SET quantity = quantity + ?, updatedAt = NOW() WHERE id = ?`,
        { type: QueryTypes.UPDATE, replacements: [quantity, existsItems[0].id] }
      );
    } else {
      // Insert new item
      await sequelize.query(
        `INSERT INTO cart_items(cart_id, menu_item_id, quantity, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())`,
        {
          type: QueryTypes.INSERT,
          replacements: [cartId, menu_item_id, quantity],
        }
      );
    }

    // Return cart items
    const cartData = await sequelize.query(
      `SELECT ci.id as cart_item_id, ci.menu_item_id, ci.quantity, mi.name, mi.price, mi.image_url
     FROM cart_items ci
     JOIN carts c ON ci.cart_id = c.id
     JOIN menu_items mi ON ci.menu_item_id = mi.id
     WHERE c.user_id = ?`,
      { type: QueryTypes.SELECT, replacements: [userId] }
    );

    return res.status(200).json({
      message: "Item added to cart successfully!",
      cartId,
      data: cartData,
    });
  }
  // get
  static async getCart(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Invalid, you don't have access to this" });
    }

    const cartData = await sequelize.query(
      `SELECT ci.id as cart_item_id, ci.menu_item_id, ci.quantity, 
            mi.name, mi.price, mi.image_url
     FROM cart_items ci
     JOIN carts c ON ci.cart_id = c.id
     JOIN menu_items mi ON ci.menu_item_id = mi.id
     WHERE c.user_id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [userId],
      }
    );

    res.status(200).json({
      message: "Cart fetched successfully",
      data: cartData,
    });
  }

  // delete cart
  static async deleteCart(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const cartItemId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Please login first" });
    }

    // Check item belongs to this user cart
    const existItem: any = await sequelize.query(
      `SELECT ci.id 
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
      WHERE ci.id = ? AND c.user_id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [cartItemId, userId],
      }
    );

    if (!existItem || existItem.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Delete cart item
    await sequelize.query(
      `DELETE ci FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
     WHERE ci.id = ? AND c.user_id = ?`,
      {
        type: QueryTypes.DELETE,
        replacements: [cartItemId, userId],
      }
    );

    res.status(200).json({ message: "Cart item deleted successfully" });
  }
  // static async mergeGuestCart(req: IExtendedRequest, res: Response) {
  //   const userId = req.user?.id;
  //   const { items } = req.body;

  //   if (!userId) return res.status(401).json({ message: "Unauthorized" });

  //   for (const item of items) {
  //     const [cart]: any = await sequelize.query(
  //       `SELECT id FROM carts WHERE user_id = ?`,
  //       {
  //         type: QueryTypes.SELECT,
  //         replacements: [userId],
  //       }
  //     );
  //     let cartId = cart?.id;
  //     if (!cartId) {
  //       const [newCartId] = await sequelize.query(
  //         `INSERT INTO carts(user_id, createdAt, updatedAt) VALUES(?, NOW(), NOW())`,
  //         { type: QueryTypes.INSERT, replacements: [userId] }
  //       );
  //       cartId = newCartId;
  //     }

  //     const existsItems: any = await sequelize.query(
  //       `SELECT id FROM cart_items WHERE cart_id=? AND menu_item_id=?`,
  //       { type: QueryTypes.SELECT, replacements: [cartId, item.menu_item_id] }
  //     );

  //     if (existsItems.length > 0) {
  //       await sequelize.query(
  //         `UPDATE cart_items SET quantity = quantity + ? WHERE id=?`,
  //         {
  //           type: QueryTypes.UPDATE,
  //           replacements: [item.quantity, existsItems[0].id],
  //         }
  //       );
  //     } else {
  //       await sequelize.query(
  //         `INSERT INTO cart_items(cart_id, menu_item_id, quantity, createdAt, updatedAt) VALUES(?,?,?,NOW(),NOW())`,
  //         {
  //           type: QueryTypes.INSERT,
  //           replacements: [cartId, item.menu_item_id, item.quantity],
  //         }
  //       );
  //     }
  //   }

  //   const cartData = await sequelize.query(
  //     `SELECT ci.id as cart_item_id, ci.menu_item_id, ci.quantity, mi.name, mi.price, mi.image_url
  //    FROM cart_items ci
  //    JOIN carts c ON ci.cart_id=c.id
  //    JOIN menu_items mi ON ci.menu_item_id=mi.id
  //    WHERE c.user_id=?`,
  //     { type: QueryTypes.SELECT, replacements: [userId] }
  //   );

  //   localStorage.removeItem("guest_cart");

  //   res.status(200).json({ message: "Guest cart merged", data: cartData });
  // }
  static async updateCart(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "Invalid quantity" });

    const [item]: any = await sequelize.query(
      `SELECT ci.id FROM cart_items ci
     JOIN carts c ON ci.cart_id = c.id
     WHERE ci.id = ? AND c.user_id = ?`,
      { type: QueryTypes.SELECT, replacements: [cartItemId, userId] }
    );

    if (!item) return res.status(404).json({ message: "Cart item not found" });

    await sequelize.query(
      `UPDATE cart_items SET quantity = ?, updatedAt = NOW() WHERE id = ?`,
      { type: QueryTypes.UPDATE, replacements: [quantity, cartItemId] }
    );

    res.status(200).json({ message: "Cart updated successfully" });
  }
}

export default MyCart;
