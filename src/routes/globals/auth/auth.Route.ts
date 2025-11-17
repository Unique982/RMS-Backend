import express, { Router } from "express";
import Authentication from "../../../controller/globals/auth/auth.Controller";
const router: Router = express.Router();
import passport from "../../../database/config/passport/google";
import asyncErrorHandle from "../../../services/asyncErrorhandle";
import jwt from "jsonwebtoken";

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

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req: any, res) => {
    try {
      // Fix: user exists or not
      if (!req.user) {
        return res.redirect("http://localhost:3000/?error=UserNotFound");
      }

      const user = req.user;

      // Create JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET! as string,
        { expiresIn: "7d" }
      );

      // Redirect to frontend with token
      res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    } catch (error) {
      console.error(error);
      res.redirect("http://localhost:3000/?error=GoogleAuthFailed");
    }
  }
);

export default router;
