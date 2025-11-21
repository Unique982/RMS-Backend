import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import MyCart from "../../../controller/customer/cart/cart.Controller";
const router: Router = express.Router();
router
  .route("/")
  .post(asyncErrorHandle(MyCart.createCart))
  .get(asyncErrorHandle(MyCart.getCart));

router
  .route("/:id")
  .delete(asyncErrorHandle(MyCart.deleteCart))
  .patch(asyncErrorHandle(MyCart.updateCart));
router.route("/merge").post(asyncErrorHandle(MyCart.mergeGuestCart));

export default router;
