import { User } from '../models/user.model';

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email: email.toLowerCase() } });
  },
};
