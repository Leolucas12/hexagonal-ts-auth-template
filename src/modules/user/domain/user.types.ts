import { Role } from '@prisma/client';

// All properties that a User has
export interface UserProps {
  role: Role;
  email: string;
  name: string;
  password: string;
}

// Properties that are needed for a user creation
export interface CreateUserProps {
  email: string;
  name: string;
  role: Role;
  password: string;
}

export enum UserRoles {
  admin = 'admin',
  user = 'user',
  client = 'client',
}
