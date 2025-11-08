import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import RestoreData from "../../../controller/admin/RestoreData/restore.Controller";
const router: Router = express.Router();

// 🔸 Filter गरेर data ल्याउने
router
  .route("/")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(RestoreData.restoreData)
  );

// // 🔸 Restore गर्ने (single item)
// router.post("/:type/:id", RestoreController.restoreData);

export default router;
