import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import Blog from "../../../controller/admin/blog/blog.Controller";
import upload from "../../../middleware/Multer/multerUpload";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";

const router: Router = express.Router();

router
  .route("")
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    upload.single("blogImage"),
    asyncErrorHandle(Blog.createBlog)
  )
  .get(asyncErrorHandle(Blog.allBlogList));

// delete update  single view
router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Blog.blogDelete)
  )
  .get(asyncErrorHandle(Blog.singleBlog))
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    upload.single("blogImage"),
    asyncErrorHandle(Blog.updateBlog)
  );

export default router;
