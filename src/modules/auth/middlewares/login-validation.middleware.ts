import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginRequestDTO } from '../dtos/LoginRequestDTO';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const body = req.body as LoginRequestDTO;

    const loginRequestBody = new LoginRequestDTO();
    loginRequestBody.email = body.email;
    loginRequestBody.password = body.password;

    const validations = await validate(loginRequestBody);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce<string[]>((acc, curr) => {
          return [...acc, ...Object.values(curr.constraints || {})];
        }, []),
      );
    }

    next();
  }
}
