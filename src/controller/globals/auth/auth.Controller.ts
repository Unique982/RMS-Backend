// login
import { Request, Response } from "express";
import User from "../../../database/models/users.model";

import bcrypt from "bcrypt";
import generatedJwtWebToken from "../../../services/generatedJWTWEBTOKEN";
import generatedOTP from "../../../services/generatedOtp";
import mailSend from "../../../services/mailSend";
import { IExtendedRequest, userRole } from "../../../middleware/types/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";

import HelperNotification from "../../notification/notification.Controller";
interface OTP {
  otp: number | null;
  otp_exp: Date | null;
}
class Authentication {
  // registe user input
  static userRegsiter = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // this user email already exits or not
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "This user already existing" });
    try {
      const user = await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 12),
      });
      // sned email
      const mailInformation = {
        to: email,
        subject: "Welcome to The 90's Restaurant & Bar! ",
        text: `<table
  cellpadding="0"
  cellspacing="0"
  width="100%"
  style="
    max-width: 600px;
    margin: auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
  "
>
  <tr>
    <td style="padding: 30px">
      <h2 style="color: #333333; margin-top: 0">Welcome ${username}!</h2>
      <p style="font-size: 16px; color: #555555">
           Your account has been created successfully at The 90's Restaurant & Bar.
        </p>
          <p style="font-size: 16px; color: #555555">
           You can now login and enjoy our services.
        </p>

      <table cellpadding="0" cellspacing="0" style="margin-top: 15px">
         <tr>
              <td align="center" style="padding:20px 0;">
                <span style="font-size:25px; font-weight:bold; color:#000000; background-color:#f1f1f1; padding:15px 30px; border-radius:5px; display:inline-block;">
                 ${email}
                </span>
              </td>
            </tr>
             <tr>
            <td align="center" bgcolor="#2a00e6ff" style="border-radius:5px;">
              <a href="https://your-website-login.com" target="_blank" style="display:inline-block;padding:15px 30px;font-size:16px;color:#ffffff;text-decoration:none;border-radius:5px;">
                Login Now
              </a>
            </td>
            
              
            
            </tr>
          </table>
          <td style="background-color:#f1f1f1; padding:15px; text-align:center; color:#555555; font-size:14px; border-radius:5px;">
                &copy; 2025 The 90's Restaurant & Bar. All rights reserved.<br>
                <a href="https://www.instagram.com/the_90s_restaurant_and_bar/" style="color:#d32f2f; text-decoration:none;">Follow us on Instagram</a>

      
`,
      };
      await mailSend(mailInformation);

      const notification = await HelperNotification.createNotification({
        title: "Registration Successful",
        description: "Welcome! You are registered as Customer.",
        user_id: user.id,
      });
      console.log("Notification created:", notification);
      res.status(200).json({
        message: "User account created successfuly!",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something wrong!" });
    }
  };
  //login user input
  static async userLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "All fields are required " });

      // user existi or not
      const userExists = await User.findOne({ where: { email } });
      if (!userExists)
        return res.status(404).json({ message: "This email not registered" });

      //check password metch or not
      const isMatch = bcrypt.compareSync(password, userExists.password);
      // if not match then
      if (!isMatch) return res.json({ message: "Invalid credentials" });
      //token verify
      const token = generatedJwtWebToken({
        id: userExists.id,
        role: userExists.role,
        username: userExists.username,
      });
      console.log("userExists:", userExists);

      // create notification
      const notification = await HelperNotification.createNotification({
        title: "Login Successful",
        description: "You are logged in successfully.",

        user_id: userExists.id,
      });

      res.status(200).json({
        message: "Login successfully",
        token: token,
        user: {
          id: userExists.id,
          role: userExists.role,
          username: userExists.username,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something wrong" });
    }
  }

  // forget password
  static async forgetPassword(req: Request, res: Response) {
    // user bat email input throw lina
    const { email } = req.body;
    // user email ma aaya na vani input garw vann msg garxa
    if (!email) return res.status(400).json({ message: "Email are required" });
    // user email patha ko db exists xa ki ni check garxa
    const emailExists = await User.findOne({
      where: {
        email,
      },
    });
    // if user pataha ko email thik xain vani
    if (!emailExists) return res.status(400).json({ messag: "invalid email!" });

    // random otp send garnu paro
    const otp = generatedOTP();
    emailExists.otp = otp;
    emailExists.otp_exp = new Date(Date.now() + 5 * 60 * 1000);
    await emailExists.save();

    // send email
    const mailInformation = {
      to: emailExists.email,
      subject: "The 90's Restaurant & Bar - Password Reset",
      text: `<table
  cellpadding="0"
  cellspacing="0"
  width="100%"
  style="
    max-width: 600px;
    margin: auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
  "
>
  <tr>
    <td style="padding: 30px">
      <h2 style="color: #333333; margin-top: 0">The 90's Restaurant & Bar - Password Reset</h2>
      <p style="font-size: 16px; color: #555555">
         You requested a password reset. Use the OTP below to reset your password:
      </p>

      <table cellpadding="0" cellspacing="0" style="margin-top: 15px">
         <tr>
              <td align="center" style="padding:20px 0;">
                <span style="font-size:35px; font-weight:bold; color:#000000; background-color:#f1f1f1; padding:15px 30px; border-radius:5px; display:inline-block;">
                 ${otp}
                </span>
              </td>
            </tr>
        <tr>
              <td style="padding:20px 0; color:#555555; font-size:16px; line-height:24px; ">
                This OTP is valid for <strong>2 minutes</strong>. Please do not share it with anyone.
              </td>
            </tr>
            <tr>
              <td style="background-color:#f1f1f1; padding:15px; text-align:center; color:#555555; font-size:14px; border-radius:5px;">
                If you did not request this OTP, please ignore this email.<br>
                &copy; 2025 The 90's Restaurant & Bar. All rights reserved.<br>
                <a href="https://www.instagram.com/the_90s_restaurant_and_bar/" style="color:#d32f2f; text-decoration:none;">Follow us on Instagram</a>
              </td>
            </tr>
          </table>

          <!-- Outer Footer -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
            <tr>
             <td
      style="
        background-color: #f1f1f1;
        text-align: center;
        padding: 15px;
        font-size: 13px;
        color: #777;
      "
    >
      &copy; 2025 Unique Bus Sewa. All rights reserved.
    </td>

            </tr>
          </table>
        </td>
      </tr>
    </table>
`,
    };
    await mailSend(mailInformation);
    res.status(200).json({ message: "Otp send successfully!.Check email" });
  }

  // verfiy otp password
  static async verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res
        .status(400)
        .json({ message: "Please provide email and otp code!" });

    const userExists = await User.findOne({
      where: {
        email,
      },
    });
    if (!userExists)
      return res.status(400).json({ message: "Email not regsiter!" });

    // verfiy password check
    if (userExists.otp !== Number(otp))
      return res.status(400).json({ message: "Invalid password!" });

    // exp data
    if (userExists.otp_exp <= new Date()) {
      res.status(400).json({ message: "Expried has otp! Resend password" });
    } else {
      // set
      userExists.otp;
      userExists.otp_exp;

      await userExists.save();
      res.status(200).json({ message: "Otp successfully!" });
    }
  }

  // chenge new password
  static async changePassword(req: Request, res: Response) {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword)
      return res.json({ message: "All filed are required!" });

    // check new password and confirm password
    if (newPassword !== confirmPassword)
      return res.json({
        message: "New Password and confirm password not match!",
      });
    // check email
    const userExists = await User.findOne({ where: { email } });
    if (!userExists) return res.json({ message: "Email not register" });

    //
    userExists.password = bcrypt.hashSync(newPassword, 12);
    await userExists.save();
    // notification create
    const notification = await HelperNotification.createNotification({
      title: "Password Change Successfully!",
      description: "Your password has been updated successfully.",
      user_id: userExists.id,
    });
    res.status(200).json({ message: "Password chnage successfully!" });
  }

  // profile
  static async profileUpdate(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const { username, email } = req.body;
    if (!username || !email)
      return res.status(400).json({ message: "All field are require" });

    const userExists = await sequelize.query(
      `SELECT id FROM users WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [userId],
      }
    );
    if (!userId || userId.length === 0)
      return res.status(404).json({ message: "User id not found" });

    await sequelize.query(
      `UPDATE users SET username = ?, email = ? WHERE id = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [username, email, userId],
      }
    );
    res.status(200).json({ message: "Profile updated successfull!" });
  }

  // user logout
  static async userLogout(req: IExtendedRequest, res: Response) {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Not logged In" });
    }
    // notification save
    const notification = await HelperNotification.createNotification({
      title: "Logout Successfully!",
      description: `${req.user.username} logged out successfully`,

      user_id: userId,
    });
    res.status(200).json({ message: "Logout successfully", notification });
  }
}
export default Authentication;
