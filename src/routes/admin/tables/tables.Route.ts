import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import Tables from "../../../controller/admin/tables/tables.Controller";
import { userRole } from "../../../middleware/types/type";

const router: Router = express.Router();

router
  .route("/")
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Tables.createTable)
  );
router.route("/").get(asyncErrorHandle(Tables.getTables));

// delete
router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Tables.deleteTable)
  )
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Tables.singleTables)
  )
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Tables.updateTables)
  );
// table status update
router
  .route("/status/:id")
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(Tables.tableStatusUdapte)
  );

export default router;
