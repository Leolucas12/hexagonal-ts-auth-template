import { AggregateID } from '@libs/ddd';
import { ConflictException } from '@libs/exceptions';
import { UserEntity } from '@modules/user/domain/user.entity';
import { UserAlreadyExistsError } from '@modules/user/domain/user.errors';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/libs/prisma/prisma.service';
import { hash } from 'bcrypt';
import { Err, Ok, Result } from 'oxide.ts';
import { UserProps } from '../../domain/user.types';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<Result<AggregateID, UserAlreadyExistsError>> {
    const userProps: UserProps = {
      email: command.email,
      name: command.name,
      password: await hash(command.password, 10),
      role: command.role,
    };

    const user = UserEntity.create(userProps);

    try {
      await this.prisma.$transaction([
        this.prisma.user.create({ data: userProps }),
      ]);
      return Ok(user.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
