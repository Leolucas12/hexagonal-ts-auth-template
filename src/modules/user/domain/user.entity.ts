import { AggregateID, AggregateRoot } from '@libs/ddd';
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UserCreatedDomainEvent } from './events/user-created.domain-event';
import { UserDeletedDomainEvent } from './events/user-deleted.domain-event';
import { UserRoleChangedDomainEvent } from './events/user-role-changed.domain-event';
import { CreateUserProps, UserProps } from './user.types';

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateUserProps): UserEntity {
    const id = randomUUID();
    /* Setting a default role since we are not accepting it during creation. */
    const props: UserProps = { ...create, role: Role.USER };
    const user = new UserEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        email: props.email,
        name: props.name,
      }),
    );
    return user;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */
  get role(): Role {
    return this.props.role;
  }

  private changeRole(newRole: Role): void {
    this.addEvent(
      new UserRoleChangedDomainEvent({
        aggregateId: this.id,
        oldRole: this.props.role,
        newRole,
      }),
    );

    this.props.role = newRole;
  }

  makeAdmin(): void {
    this.changeRole(Role.ADMIN);
  }

  makeClient(): void {
    this.changeRole(Role.CLIENT);
  }

  delete(): void {
    this.addEvent(
      new UserDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
