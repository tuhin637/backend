import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { HrUser, LoginDTO, JwtPayload } from '../types/auth.types';

export class AuthService {
  async login(payload: LoginDTO): Promise<{ token: string; user: Omit<HrUser, 'password_hash'> }> {
    const user = await db<HrUser>('hr_users').where({ email: payload.email }).first();

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(payload.password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
      expiresIn: '8h',
    });

    const { password_hash, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }
}