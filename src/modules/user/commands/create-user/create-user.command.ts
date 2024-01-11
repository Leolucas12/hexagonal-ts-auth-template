import { Command, CommandProps } from '@libs/ddd';
import { Role } from '@prisma/client';

export class CreateUserCommand extends Command {
  readonly email: string;

  readonly name: string;

  readonly password: string;

  readonly role: Role;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.name = props.name;
    this.password = props.password;
    this.role = props.role;
  }
}
