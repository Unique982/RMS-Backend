import express, { Router } from "express";
import asyncErrorHandle from "../../services/asyncErrorhandle";
import BookingTable from "../../controller/tableBooking/booking.Controller";
const router: Router = express.Router();

router.route("/").post(asyncErrorHandle(BookingTable.createReservation));
export default router;
