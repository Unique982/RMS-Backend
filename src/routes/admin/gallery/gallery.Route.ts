import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import Gallery from "../../../controller/admin/gallery/gallery.Controller";
import upload from "../../../middleware/Multer/multerUpload";

const router: Router = express.Router();
router
  .route("")
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    upload.array("image", 30),
    asyncErrorHandle(Gallery.uploadImage)
  )
  .get(asyncErrorHandle(Gallery.getAllImage));

// delete
router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Gallery.deleteImage)
  )

  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Gallery.singleImage)
  );

export default router;
