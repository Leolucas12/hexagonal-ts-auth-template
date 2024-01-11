import { NotFoundException } from '@libs/exceptions';
import { CommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/libs/prisma/prisma.service';
import { Err, Ok, Result } from 'oxide.ts';

export class DeleteUserCommand {
  readonly userId: string;

  constructor(props: DeleteUserCommand) {
    this.userId = props.userId;
  }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserService {
  constructor(private prisma: PrismaService) {}

  async execute(
    command: DeleteUserCommand,
  ): Promise<Result<boolean, NotFoundException>> {
    const found = await this.prisma.user.findUnique({
      where: { id: command.userId },
    });
    if (!found) return Err(new NotFoundException());
    const result = await this.prisma.user.delete({ where: { id: found.id } });
    return Ok(!!result);
  }
}
