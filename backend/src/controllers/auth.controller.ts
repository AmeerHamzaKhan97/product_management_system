import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { authService } from '../services/auth.service';
import { successResponse } from '../utils/response.util';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ success: false, message: errors.array()[0].msg });
        return;
      }

      const { email, password } = req.body as { email: string; password: string };
      const data = await authService.login(email, password);
      successResponse(res, data, 'Login successful.');
    } catch (err) {
      next(err);
    }
  },
};
