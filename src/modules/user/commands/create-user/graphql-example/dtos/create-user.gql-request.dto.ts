import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@ArgsType()
@InputType()
export class CreateUserGqlRequestDto {
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  @Field()
  readonly email: string;

  @IsString()
  @Field()
  readonly role: Role;

  @Field()
  readonly name: string;

  @Field()
  readonly password: string;
}
