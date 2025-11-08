import express, { Router } from "express";

import asyncErrorHandle from "../../../services/asyncErrorhandle";
import CustomerList from "../../../controller/admin/customer/customer.Controller";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
const router: Router = express.Router();

router.route("/").get(asyncErrorHandle(CustomerList.listCustomer));
router
  .route("/:id")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(CustomerList.singleDetailsCustomer)
  )
  .delete(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(CustomerList.deleteCustomer)
  );

export default router;
