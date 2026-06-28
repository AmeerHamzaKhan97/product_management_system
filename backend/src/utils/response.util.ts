import { Response } from 'express';

export function successResponse(
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200,
): void {
  res.status(statusCode).json({ success: true, message, data });
}

export function errorResponse(res: Response, message: string, statusCode = 500): void {
  res.status(statusCode).json({ success: false, message });
}
