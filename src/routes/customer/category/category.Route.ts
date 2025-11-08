import express, { Router } from "express";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import ViewCategory from "../../../controller/customer/category/category.Controller";
const router: Router = express.Router();
router.route("/").get(asyncErrorHandle(ViewCategory.getCategory));

export default router;
