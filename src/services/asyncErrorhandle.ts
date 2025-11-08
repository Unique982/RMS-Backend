import { Request, Response, NextFunction } from "express";

const asyncErrorHandle = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => {
      res.status(400).json({ message: err.message, fullError: err });
      console.log(err);
    });
  };
};
export default asyncErrorHandle;
