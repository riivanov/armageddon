import express, { NextFunction } from "express";

export const tryCatch =
  (controller: any) =>
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      return next(error);
    }
  };
