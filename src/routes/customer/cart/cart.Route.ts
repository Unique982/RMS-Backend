import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import MyCart from "../../../controller/customer/cart/cart.Controller";
import Middleware from "../../../middleware/middleware";

const router: Router = express.Router();
router
  .route("/")
  .post(Middleware.isLoggedIn, asyncErrorHandle(MyCart.createCart))
  .get(Middleware.isLoggedIn, asyncErrorHandle(MyCart.getCart));

router
  .route("/:cart_id")
  .delete(asyncErrorHandle(MyCart.deleteCart))
  .patch(asyncErrorHandle(MyCart.updateCart));
// router.route("/merge").post(asyncErrorHandle(MyCart.mergeGuestCart));

export default router;
