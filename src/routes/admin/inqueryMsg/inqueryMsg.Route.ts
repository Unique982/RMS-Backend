import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import inqueryMsg from "../../../controller/admin/inqueryMsg/inqueryMsg.Controller";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
const router: Router = express.Router();
router
  .route("/")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(inqueryMsg.getAllInqueryMsg)
  );
router
  .route("/:id")
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(inqueryMsg.sendReply)
  );
export default router;
