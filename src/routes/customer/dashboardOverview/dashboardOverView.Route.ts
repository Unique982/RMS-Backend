import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import MyDashboardOwerView from "../../../controller/customer/dashboardOverviwe/dashboardOverView.Controller";
const router: Router = express.Router();

router
  .route("/order/total")
  // Complete order
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(MyDashboardOwerView.getMyAllOrder)
  );
// My Pending order total
router
  .route("/orders/pending")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(MyDashboardOwerView.getPendingMyOrder)
  );
// complete order
router
  .route("/orders/complete")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(MyDashboardOwerView.getCompletedMyOrder)
  );
//Reward point total
router
  .route("/orders/reward/point")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(MyDashboardOwerView.getUserPoints)
  );

// total payment
router
  .route("/orders/pay")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(MyDashboardOwerView.getMyTotalPayment)
  );

export default router;
