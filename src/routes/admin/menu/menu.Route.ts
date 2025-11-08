import express, { Router } from "express";
import Menu from "../../../controller/admin/menu/menu.Controller";

import asyncErrorHandle from "../../../services/asyncErrorhandle";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
const router: Router = express.Router();

router
  .route("/")
  .get(asyncErrorHandle(Menu.getMenuItems))
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Menu.createMenuItems)
  );

router
  .route("/:id")
  .get(asyncErrorHandle(Menu.singleMenuItems))
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Menu.editMenuItems)
  )
  .delete(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Menu.deleteMenuItems)
  );

export default router;
