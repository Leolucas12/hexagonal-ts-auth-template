import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { FindUserByEmailService } from '../user/queries/find-user-by-email/find-user-by-email.service';
import { UserPayload } from './dtos/UserPayload';
import { UserToken } from './dtos/UserToken';
import { UnauthorizedError } from './errors/unauthorized.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: FindUserByEmailService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: 'test',
      }),
      role: payload.role,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const result = await this.userService.execute({email});
    const user = result.unwrap();

    if (user) {
      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: '',
        };
      }
    }

    throw new UnauthorizedError('Endereço de email ou senha incorretos.');
  }
}
