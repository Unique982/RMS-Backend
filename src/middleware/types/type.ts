import { Request } from "express";

export enum userRole {
  Admin = "admin",
  Customer = "customer",
}
export interface IExtendedRequest extends Request {
  user?: any;
}
