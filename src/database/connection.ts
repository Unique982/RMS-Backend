import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";
import User from "./models/users.model";

import Tables from "./models/table.model";
import Reservation from "./models/reservations.model";
import Category from "./models/category.model";
import MenuItem from "./models/menuItem.model";
import Order from "./models/order.model";
import OrderItem from "./models/orderItems.model";
import About from "./models/about.model";
import Service from "./models/service.model";
import Blog from "./models/blog.model";
import ContactUs from "./models/contact.model";
import Cart from "./models/cart.model";
import Payment from "./models/payment.model";
import CartItem from "./models/cartItems.model";
import Gallery from "./models/gallery.model";
import Setting from "./models/setting.model";
// load env
config();

// sequelize instance
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  dialect: "mysql",
  port: Number(process.env.DB_PORT),
  models: [__dirname + "/models"],
});

// database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Authenticated connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
// sequelize migrate sync
sequelize.sync({ alter: false }).then(() => {
  console.log("migrated successfully!");
});

// relastion ship
// User - Reservation
// User - Reservation
User.hasMany(Reservation, { foreignKey: "user_id" });
Reservation.belongsTo(User, { foreignKey: "user_id" });

// Tables - Reservation
Tables.hasMany(Reservation, { foreignKey: "table_id" });
Reservation.belongsTo(Tables, { foreignKey: "table_id" });

// menu relation category tabel
Category.hasMany(MenuItem, { foreignKey: "category_id" });
MenuItem.belongsTo(Category, { foreignKey: "category_id" });

// order and customer realtion
// order and table relation\

// user to order
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// table to order
// Table ↔ Order
Tables.hasMany(Order, { foreignKey: "table_id" });
Order.belongsTo(Tables, { foreignKey: "table_id" });

// order
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
// MenuItem ↔ OrderItem
MenuItem.hasMany(OrderItem, { foreignKey: "menu_item_id" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menu_item_id" });

// User ↔ Cart
User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

// Cart ↔ CartItem
Cart.hasMany(CartItem, { foreignKey: "cart_id" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

// MenuItem ↔ CartItem
MenuItem.hasMany(CartItem, { foreignKey: "menu_item_id" });
CartItem.belongsTo(MenuItem, { foreignKey: "menu_item_id" });

// order and payent relationship
Order.hasMany(Payment, { foreignKey: "orderId" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

export default sequelize;
