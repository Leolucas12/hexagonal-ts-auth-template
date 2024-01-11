import { DomainEvent, DomainEventProps } from '@libs/ddd';
import { Role } from '@prisma/client';

export class UserRoleChangedDomainEvent extends DomainEvent {
  readonly oldRole: Role;

  readonly newRole: Role;

  constructor(props: DomainEventProps<UserRoleChangedDomainEvent>) {
    super(props);
    this.oldRole = props.oldRole;
    this.newRole = props.newRole;
  }
}
