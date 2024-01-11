import { Role } from "@prisma/client";

export interface UserToken {
  access_token: string;
  role: Role;
}
