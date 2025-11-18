import express, { Router } from "express";
import Middleware from "../../middleware/middleware";
import asyncErrorHandle from "../../services/asyncErrorhandle";
import HelperNotification from "../../controller/notification/notification.Controller";

const router: Router = express.Router();

router
  .route("/")
  .get(
    Middleware.isLoggedIn,
    asyncErrorHandle(HelperNotification.getNotication)
  );
// .post(
//   Middleware.isLoggedIn,
//   Middleware.restrictTo(userRole.Admin),
//   asyncErrorHandle(AdminNotificatio)
// );

// make all read update
router
  .route("/read-all")
  .patch(
    Middleware.isLoggedIn,
    asyncErrorHandle(HelperNotification.makeAllRead)
  );

export default router;
