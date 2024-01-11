import { User } from '@prisma/client';
import { Entity } from './entity.base';

export interface Mapper<
  DomainEntity extends Entity<any>,
  User,
  Response = any,
> {
  toPersistence(entity: DomainEntity): User;
  toDomain(record: any): DomainEntity;
  toResponse(entity: DomainEntity): Response;
}
