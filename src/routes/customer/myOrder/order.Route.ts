import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import MyOrder from "../../../controller/customer/myOrder/order.Controller";
const router: Router = express.Router();

router
  .route("/")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(MyOrder.getMyOrder)
  )
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(MyOrder.createOrder)
  );

// view single
router
  .route("/soft-delete/:id")
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(MyOrder.softDeleteMyOrder)
  );
router
  .route("/:id")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(MyOrder.getSingleMyOrder)
  );
export default router;
