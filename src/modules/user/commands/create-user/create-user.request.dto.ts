import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'User email address',
  })
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'France', description: 'Country of residence' })
  @IsString()
  readonly role: Role;

  @ApiProperty({ example: '28566', description: 'Postal code' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'Grande Rue', description: 'Street' })
  @IsString()
  readonly password: string;
}
