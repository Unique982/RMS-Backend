import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import About from "../../../controller/admin/about/about.Controller";
import upload from "../../../middleware/Multer/multerUpload";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
const router: Router = express.Router();

router
  .route("/")
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    upload.single("aboutImage"),
    asyncErrorHandle(About.aboutSection)
  )
  .get(asyncErrorHandle(About.getAbout));

router.route("/:id").get(asyncErrorHandle(About.singleAbout));

export default router;
