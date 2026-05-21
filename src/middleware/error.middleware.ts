import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) {
  console.error(err);

  return res.status(500).json({
    error: "Internal Server Error",
  });
}