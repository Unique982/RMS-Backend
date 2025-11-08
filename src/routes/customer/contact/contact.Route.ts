import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import ContactUs from "../../../controller/customer/contact/contact.Controller";
const router: Router = express.Router();
router.route("/").post(asyncErrorHandle(ContactUs.sendMsg));

export default router;
