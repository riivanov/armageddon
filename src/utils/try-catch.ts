import { AxiosError } from "axios";
import express, { NextFunction } from "express";

export const tryCatch =
  (controller: any) =>
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      if (error instanceof AxiosError) {
        error.status = error.response?.data.code;
        error.message = error.response?.data.error_message;
      }

      return next(error);
    }
  };
