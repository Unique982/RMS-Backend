import express, { Router } from "express";

import asyncErrorHandle from "../../../services/asyncErrorhandle";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import HelperNotification from "../../../controller/notification/notification.Controller";

const router: Router = express.Router();

router
  .route("/")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(HelperNotification.getNotication)
  );
// .post(
//   Middleware.isLoggedIn,
//   Middleware.restrictTo(userRole.Admin),
//   asyncErrorHandle(AdminNotificatio)
// );

// make all read update
router
  .route("/:id")
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(HelperNotification.makeAllRead)
  );

export default router;
