import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserEntity } from './domain/user.entity';
import { UserResponseDto } from './dtos/user.response.dto';

/**
 * Mapper constructs objects that are used in different layers:
 * Record is an object that is stored in a database,
 * Entity is an object that is used in application domain layer,
 * and a ResponseDTO is an object returned to a user (usually as json).
 */

@Injectable()
export class UserMapper implements Mapper<UserEntity, User, UserResponseDto> {
  toPersistence(entity: UserEntity): User {
    const copy = entity.getProps();
    const record: User = {
      id: copy.id,
      email: copy.email,
      password: copy.password,
      name: copy.name,
      role: copy.role,
      created_at: copy.created_at,
      updated_at: copy.updated_at,
    };
    return record;
  }

  toDomain(record: User): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      props: {
        email: record.email,
        name: record.name,
        role: record.role,
        password: record.password,
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto(entity);
    response.email = props.email;
    response.name = props.name;
    return response;
  }

  /* ^ Data returned to the user is whitelisted to avoid leaks.
     If a new property is added, like password or a
     credit card number, it won't be returned
     unless you specifically allow this.
     (avoid blacklisting, which will return everything
      but blacklisted items, which can lead to a data leak).
  */
}
