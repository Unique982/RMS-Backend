import jwt from "jsonwebtoken";
import { userRole } from "../middleware/types/type";

const generatedJwtWebToken = (data: {
  id: number;
  role: userRole;
  username: string;
}) => {
  // @ts-ignore
  const token = jwt.sign(data, process.env.JWT_WEB_TOKEN!, {
    expiresIn: process.env.EXPIRESIN!,
  });
  return token;
};
export default generatedJwtWebToken;
