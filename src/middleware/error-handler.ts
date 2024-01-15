import express, { NextFunction } from "express";

export const errorHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  // Logging the error here
  console.log(error);
  // Returning the status and error message to client
  res.status(400).send({ error: true, message: error.message });
};
