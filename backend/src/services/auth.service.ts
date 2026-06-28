import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { userRepository } from '../repositories/user.repository';
import { IAuthResponse, UnauthorizedError } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<IAuthResponse> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn as unknown as SignOptions['expiresIn'] },
    );

    return {
      token,
      user: { id: user.id, email: user.email },
    };
  },
};
