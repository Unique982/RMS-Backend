import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebokStrategy } from "passport-facebook";
import User from "../../models/users.model";
import { config } from "dotenv";
import mailSend from "../../../services/mailSend";
import HelperNotification from "../../../controller/notification/notification.Controller";

config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:4000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ where: { google_id: profile.id } });

        // check user xa ki nai
        if (!user) {
          user = await User.create({
            google_id: profile.id,
            email: profile.emails?.[0].value,
            username: profile.displayName,
          });

          // send mail
          const mailInformation = {
            to: user.email,
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
      <h2 style="color: #333333; margin-top: 0">Welcome ${user.username}!</h2>
      <p style="font-size: 16px; color: #555555">
           Your account has been created successfully at The 90's Restaurant & Bar.
        </p>
          <p style="font-size: 16px; color: #555555">
           You can now login and enjoy our services.
        </p>

      <table cellpadding="0" cellspacing="0" style="margin-top: 15px">
             <tr>
            <td align="center" bgcolor="#2a00e6ff" style="border-radius:5px;">
              <a href="https://your-website-login.com" target="_blank" style="display:inline-block;padding:15px 30px;font-size:16px;color:#ffffff;text-decoration:none;border-radius:5px;">
                Login Now
              </a>
            </td>
            <tr>
              <td style="background-color:#f1f1f1; padding:15px; text-align:center; color:#555555; font-size:14px; border-radius:5px;">
                &copy; 2025 The 90's Restaurant & Bar. All rights reserved.<br>
                <a href="https://www.instagram.com/the_90s_restaurant_and_bar/" style="color:#d32f2f; text-decoration:none;">Follow us on Instagram</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
`,
          };
          await mailSend(mailInformation);

          // CASE 1:  Registration Notification
          await HelperNotification.createNotification({
            title: "Registration Successful",
            description: "Your account has been created via Google.",
            user_id: user.id,
          });

          return cb(null, user);
        }
        // CASE 2: User Exists → LOGIN Case
        await HelperNotification.createNotification({
          title: "Login Successful",
          description: "You have logged in successfully using Google.",

          user_id: user.id,
        });
        return cb(null, user);
      } catch (err) {
        return cb(err, undefined);
      }
    }
  )
);
// serialize
passport.serializeUser(function (user: any, cb) {
  cb(null, user.id);
});
// deserialize user
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// facebook
// passport.use(() => {});
export default passport;
