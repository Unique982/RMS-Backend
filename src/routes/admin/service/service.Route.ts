import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import Service from "../../../controller/admin/service/service.Controller";
import upload from "../../../middleware/Multer/multerUpload";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
const router: Router = express.Router();

router
  .route("/")
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    upload.single("serviceIcon"),
    asyncErrorHandle(Service.addService)
  )
  .get(asyncErrorHandle(Service.getService));

router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Service.deleteService)
  )
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Service.updateService)
  )
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Service.singleService)
  );
export default router;
