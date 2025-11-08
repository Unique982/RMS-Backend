import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import ReservationBooking from "../../../controller/admin/reservations/reservation.Controller";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
const router: Router = express.Router();

router
  .route("/")
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(ReservationBooking.createReservation)
  )
  .get(asyncErrorHandle(ReservationBooking.getReservation));

// delete/single/update
router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(ReservationBooking.deleteReservation)
  )
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(ReservationBooking.singleReservation)
  )
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(ReservationBooking.updateReservation)
  );

// soft delete
router
  .route("/soft-delete/:id")
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(ReservationBooking.softDeleteReservation)
  );
// soft delete
router
  .route("/restore/:id")
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(ReservationBooking.restoreDeleteReservation)
  );
// status update
router
  .route("/status/:id")
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Admin),
    asyncErrorHandle(ReservationBooking.statusUpdateReservation)
  );

export default router;
