import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import AdminDashboardOverView from "../../../controller/admin/dashboard/dashboard.Controller";
const router: Router = express.Router();

router
  .route("")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(AdminDashboardOverView.getAllUser)
  );

export default router;
