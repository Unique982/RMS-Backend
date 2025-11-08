import express, { Router } from "express";
import ViewMenu from "../../../controller/customer/menu/menu.Controller";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
const router: Router = express.Router();

router
  .route("/")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    ViewMenu.viewmenu
  );
export default router;
