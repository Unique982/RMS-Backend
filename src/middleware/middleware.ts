import { NextFunction, Response } from "express";
import { IExtendedRequest, userRole } from "./types/type";
import jwt from "jsonwebtoken";
import User from "../database/models/users.model";
class Middleware {
  static isLoggedIn = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Please Provide token" });
      }
      // token verfiy
      jwt.verify(
        token,
        process.env.JWT_WEB_TOKEN as string,
        async (error, resultaayo: any) => {
          if (error) {
            return res.status(400).json({ messag: "Token invalid Vayo" });
          } else {
            const userData = await User.findByPk(resultaayo.id, {
              attributes: ["id", "role"],
            });

            if (!userData) {
              res.status(403).json({ message: "Invalid token" });
            } else {
              req.user = {
                id: userData.id,
                role: userData.role as userRole,
              };

              next();
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  // role base access

  static restrictTo = (...roles: userRole[]) => {
    return (req: IExtendedRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as userRole;
      if (roles.includes(userRole)) {
        next();
      } else {
        res
          .status(400)
          .json({ message: "Invalid, you don't have access to this" });
      }
    };
  };
}
export default Middleware;
