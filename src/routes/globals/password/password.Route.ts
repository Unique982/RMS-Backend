import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import PasswordReset from "../../../controller/globals/password/password.Controller";
const router: Router = express.Router();

router
  .route("/:id")
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin, userRole.Customer),
    asyncErrorHandle(PasswordReset.passwordReset)
  );

export default router;
