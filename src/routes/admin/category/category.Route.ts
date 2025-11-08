import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import Category from "../../../controller/admin/category/category.Controller";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";

const router: Router = express.Router();

router
  .route("/")
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Category.createCategory)
  )
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Category.getCategory)
  );

// edit / delete / single
router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Category.deleteCategory)
  )
  .get(asyncErrorHandle(Category.singleCategory))
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Category.editCategory)
  );

export default router;
