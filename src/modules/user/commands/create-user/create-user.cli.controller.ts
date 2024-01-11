import { LoggerPort } from '@libs/ports/logger.port';
import { Inject, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Role } from '@prisma/client';
import { Command, Console } from 'nestjs-console';
import { CreateUserCommand } from './create-user.command';

// Allows creating a user using CLI (Command Line Interface)
@Console({
  command: 'new',
  description: 'A command to create a user',
})
export class CreateUserCliController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(Logger)
    private readonly logger: LoggerPort,
  ) {}

  @Command({
    command: 'user <email> <country> <postalCode> <street>',
    description: 'Create a user',
  })
  async createUser(
    email: string,
    name: string,
    password: string,
    role: Role,
  ): Promise<void> {
    const command = new CreateUserCommand({
      email,
      name,
      password,
      role,
    });

    const result = await this.commandBus.execute(command);

    this.logger.log('User created:', result.unwrap());
  }
}
