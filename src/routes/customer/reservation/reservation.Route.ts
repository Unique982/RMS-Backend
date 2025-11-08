import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import Middleware from "../../../middleware/middleware";
import { userRole } from "../../../middleware/types/type";
import ReservationBooking from "../../../controller/customer/reservation/reservation.Controller";

const router: Router = express.Router();

router
  .route("/")
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(ReservationBooking.getMyReservation)
  )
  .post(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(ReservationBooking.createReservation)
  );
// update status
router
  .route("/status/:id")
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(ReservationBooking.statusChange)
  );
router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(ReservationBooking.deleteReservation)
  )
  .get(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(ReservationBooking.singleReservation)
  )
  .patch(
    Middleware.isLoggedIn,
    Middleware.restrictTo(userRole.Customer),
    asyncErrorHandle(ReservationBooking.updateReservationDate)
  );

export default router;
