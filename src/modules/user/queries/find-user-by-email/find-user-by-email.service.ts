import { NotFoundException } from '@libs/exceptions';
import { CommandHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { PrismaService } from '@src/libs/prisma/prisma.service';
import { Err, Ok, Result } from 'oxide.ts';

export class FindUserByEmailCommand {
  readonly email: string;

  constructor(props: FindUserByEmailCommand) {
    this.email = props.email;
  }
}

@CommandHandler(FindUserByEmailCommand)
export class FindUserByEmailService {
  constructor(private prisma: PrismaService) {}

  async execute(
    command: FindUserByEmailCommand,
  ): Promise<Result<User, NotFoundException>> {
    const found = await this.prisma.user.findUnique({
      where: { email: command.email },
    });
    if (!found) return Err(new NotFoundException());
    return Ok(found);
  }
}
