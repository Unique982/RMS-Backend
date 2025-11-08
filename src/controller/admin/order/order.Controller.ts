import { Response } from "express";
import { IExtendedRequest } from "../../../middleware/types/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
import { getIO } from "../../../../server";

class OrderController {
  // order create
  static async createOrder(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const {
      table_id,
      order_type,
      discount,
      status,
      payment_status,
      special_request,
      delivery_address,
      items,
    } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Order Items are required" });
    let total_amount = 0;
    // calulate from menu_item tabel
    for (let item of items) {
      const menuItem: any = await sequelize.query(
        `SELECT id, price FROM menu_items WHERE id=?`,
        {
          type: QueryTypes.SELECT,
          replacements: [item.id],
        }
      );
      if (!menuItem || menuItem.length === 0)
        return res
          .status(400)
          .json({ message: `menu item id ${item.id} not found` });

      const menuPrice = parseFloat(menuItem[0].price);
      total_amount += menuPrice * item.quantity;

      item.price = menuPrice;
    }
    const final_amount = total_amount - (discount || 0);
    // create order
    const [orderResult] = await sequelize.query(
      `INSERT INTO orders(user_id,table_id,order_type,total_amount,discount,final_amount,status,payment_status,special_request,delivery_address,created_at,updated_at)VALUES(?,?,?,?,?,?,?,?,?,?,NOW(),NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: [
          userId,
          table_id,
          order_type,
          total_amount,
          discount || 0,
          final_amount,
          status,
          payment_status,
          special_request || null,
          delivery_address || null,
        ],
      }
    );
    const order_id = orderResult;
    console.log(orderResult, "k k aayo");
    // oderItems add garnu paro
    for (let item of items) {
      const [result]: any = await sequelize.query(
        `INSERT INTO order_items(order_id,menu_item_id,quantity,price,created_at,updated_at)VALUES(?,?,?,?,NOW(),NOW())`,
        {
          type: QueryTypes.INSERT,
          replacements: [order_id, item.id, item.quantity, item.price],
        }
      );
    }
    getIO().emit("orderAdded", {
      order_id: order_id,
      user_id: userId,
      table_id: table_id,
      total_amount: total_amount,
      final_amount: total_amount - (discount || 0),
      items: items,
    });
    res.status(200).json({ message: "Order create successfully!" });
  }
  // get all order
  static async getOrder(req: IExtendedRequest, res: Response) {
    const getAllOrder: any[] = await sequelize.query(
      `SELECT 
     o.*,
     o.id AS order_id,
      t.tableNumber,
      oi.id AS order_item_id,
      oi.menu_item_id,
      oi.quantity,
      oi.price,
      u.username,
      mi.name,
      mi.description,
      mi.category_id,
      mi.image_url,
      mi.ingredients,
      mi.availability,
      mi.type
   FROM orders o
   LEFT JOIN order_items AS oi ON o.id = oi.order_id
   LEFT JOIN menu_items AS mi ON oi.menu_item_id = mi.id
   LEFT JOIN tables AS t ON o.table_id = t.id
   LEFT JOIN users AS u ON o.user_id = u.id
    WHERE o.deleted_at IS NULL
   ORDER BY o.created_at DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );
    // map orders
    const orderMap: any = {};
    getAllOrder.forEach((row: any) => {
      if (!orderMap[row.order_id]) {
        orderMap[row.order_id] = {
          order_id: row.order_id,
          user: {
            id: row.user_id,
            username: row.username,
          },
          table: {
            id: row.table_id,
            tableNumber: row.tableNumber,
          },
          order_type: row.order_type,
          total_amount: parseFloat(row.total_amount),
          discount: parseFloat(row.discount),
          final_amount: parseFloat(row.final_amount),
          status: row.status,
          payment_method: row.payment_method,
          payment_status: row.payment_status,
          special_request: row.special_request,
          delivery_address: row.delivery_address,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: [],
        };
      }
      if (row.order_item_id) {
        orderMap[row.order_id].items.push({
          order_item_id: row.order_item_id,
          menu: {
            menu_item_id: row.menu_item_id,
            name: row.name,
            description: row.description,
          },
          name: row.name,
          description: row.description,
          quantity: parseInt(row.quantity),
          price: parseFloat(row.price),
          category_id: row.category_id,
          image_url: row.image_url,
          ingredients: row.ingredients,
          availability: row.availability,
          type: row.type,
        });
      }
    });
    const orders = Object.values(orderMap);

    res.status(200).json({ message: "All order list", data: orders });
  }

  // delete order
  static async deleteOrder(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const idExists = await sequelize.query(`SELECT id FROM orders WHERE id=?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });
    if (!idExists || idExists.length === 0)
      return res.status(400).json({ message: "Order id not found!" });

    // order_item order_id delete garana
    await sequelize.query(`DELETE FROM order_items WHERE order_id =?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });
    // aba chai order tabel bat id delete garna
    await sequelize.query(`DELETE FROM orders WHERE id =?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });
    getIO().emit("orderDeleted", id);

    res.status(200).json({ message: "Delete order successfully!" });
  }

  // single order get
  static async getSingleOrder(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const getAllOrder: any[] = await sequelize.query(
      `SELECT 
      o.id AS order_id,
      o.user_id,
      o.table_id,
      o.deleted_at,
      o.order_type,
      o.total_amount,
      o.discount,
      o.final_amount,
      o.status,
      o.payment_method,
      o.payment_status,
      o.special_request,
      o.delivery_address,
      o.created_at,
      o.updated_at,
      t.tableNumber,
      oi.id AS order_item_id,
      oi.menu_item_id,
      oi.quantity,
      oi.price,
      mi.name,
      mi.description,
      mi.category_id,
      mi.image_url,
      mi.ingredients,
      mi.availability,
      mi.type
   FROM orders o
   LEFT JOIN order_items AS oi ON o.id = oi.order_id
   LEFT JOIN menu_items AS mi ON oi.menu_item_id = mi.id
   LEFT JOIN tables AS t ON o.table_id = t.id
   WHERE o.deleted_at=NULL AND o.id=?
   ORDER BY o.created_at DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (!getAllOrder || getAllOrder.length === 0)
      return res.status(400).json({ message: "Order Id not found" });
    // map orders
    const orderMap: any = {};
    getAllOrder.forEach((row: any) => {
      if (!orderMap[row.order_id]) {
        orderMap[row.order_id] = {
          order_id: row.order_id,
          user_id: row.user_id,
          table: {
            id: row.table_id,
            tableNumber: row.tableNumber,
          },
          order_type: row.order_type,
          total_amount: parseFloat(row.total_amount),
          discount: parseFloat(row.discount),
          final_amount: parseFloat(row.final_amount),
          status: row.status,
          payment_method: row.payment_method,
          payment_status: row.payment_status,
          special_request: row.special_request,
          delivery_address: row.delivery_address,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: [],
        };
      }
      if (row.order_item_id) {
        orderMap[row.order_id].items.push({
          order_item_id: row.order_item_id,
          menu: {
            menu_item_id: row.menu_item_id,
            name: row.name,
            description: row.description,
          },
          quantity: parseInt(row.quantity),
          price: parseFloat(row.price),
          category_id: row.category_id,
          image_url: row.image_url,
          ingredients: row.ingredients,
          availability: row.availability,
          type: row.type,
        });
      }
    });
    const orders = Object.values(orderMap);

    res.status(200).json({ message: "All order list", data: orders });
  }
  // update order
  static async updateOrder(req: IExtendedRequest, res: Response) {
    //   getIO().emit("orderUpdated", {
    //   order_id: id,
    //   status,
    //   payment_status,
    //   discount,
    //   items,
    // });
  }
  // soft delete
  static async softDeleteOrder(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    console.log(req.params.id);
    const idExists = await sequelize.query(`SELECT id FROM orders WHERE id=?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });
    if (!idExists || idExists.length === 0)
      return res.status(400).json({ message: "Order id not found!" });

    // order tabel ma deleted_at ma status update garana
    await sequelize.query(`UPDATE orders SET deleted_at=Now() WHERE id=?`, {
      type: QueryTypes.UPDATE,
      replacements: [id],
    });
    // order-items
    await sequelize.query(
      `UPDATE order_items SET deleted_at=Now() WHERE order_id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [id],
      }
    );
    getIO().emit("orderDeleted", { order_id: id });

    res.status(200).json({ message: "Soft delete successfully!" });
  }
  // recover delete
  static async restoreDeleteOrder(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const idExists = await sequelize.query(`SELECT id FROM orders WHERE id=?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });
    // order tabel ma deleted_at ma status update garana
    await sequelize.query(`UPDATE orders SET deleted_at=NULL WHERE id=?`, {
      type: QueryTypes.UPDATE,
      replacements: [id],
    });
    // order-items
    await sequelize.query(
      `UPDATE order_items SET deleted_at =NULL WHERE order_id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [id],
      }
    );
    getIO().emit("orderAdded", { order_id: id });
    res.status(200).json({ message: "Order restore successfully!" });
  }

  // status update
  static async orderStatusChange(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Check if order exists
    const orderExists = await sequelize.query(
      `SELECT id, status FROM orders WHERE id = ?`,
      { type: QueryTypes.SELECT, replacements: [id] }
    );

    if (!orderExists || orderExists.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update only status
    await sequelize.query(
      `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`,
      { type: QueryTypes.UPDATE, replacements: [status, id] }
    );

    // socket update
    getIO().emit("orderUpdated", { order_id: id, status });

    return res
      .status(200)
      .json({ message: "Order status updated successfully" });
  }
  // order Type update
  static async orderTypeUpdate(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const { order_type } = req.body;

    if (!order_type)
      return res.status(400).json({ message: "Order type is required" });

    const [result] = await sequelize.query(
      `UPDATE orders SET order_type=? , updated_at=NOW() WHERE id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [order_type, id],
      }
    );

    // emit socket event if needed
    getIO().emit("orderUpdated", { order_id: id, order_type });

    return res
      .status(200)
      .json({ message: "Order type updated successfully!" });
  }
}

export default OrderController;
