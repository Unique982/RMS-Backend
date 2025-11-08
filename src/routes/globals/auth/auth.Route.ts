import express, { Router } from "express";
import Authentication from "../../../controller/globals/auth/auth.Controller";
const router: Router = express.Router();
import passport from "../../../database/config/passport/google";
import asyncErrorHandle from "../../../services/asyncErrorhandle";

// regsiter
router.route("/register").post(asyncErrorHandle(Authentication.userRegsiter));
// login
router.route("/login").post(asyncErrorHandle(Authentication.userLogin));
// forget password
router.route("/forget").post(asyncErrorHandle(Authentication.forgetPassword));
// otp
router.route("/otp").post(asyncErrorHandle(Authentication.verifyOtp));
// change password
router
  .route("/reset/password")
  .post(asyncErrorHandle(Authentication.changePassword));
//login with google
// Google callback
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/google/callback")
  .get(passport.authenticate("google", { failureRedirect: "/" }), (req, res) =>
    res.redirect("/dashboard")
  );

export default router;
