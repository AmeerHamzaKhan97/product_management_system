import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { AppError } from '../types';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (env.nodeEnv !== 'production') {
    console.error(err);
  }

  res.status(500).json({ success: false, message: 'Internal server error.' });
}
