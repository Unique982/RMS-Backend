import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import Setting from "../../../controller/admin/setting/setting.Controller";

const router: Router = express.Router();

router
  .route("/")
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Setting.systemSetting)
  )
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Setting.getSetting)
  );

export default router;
