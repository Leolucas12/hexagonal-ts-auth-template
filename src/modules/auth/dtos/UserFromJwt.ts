import { Role } from "@prisma/client";

export class UserFromJwt {
  id: string;
  email: string;
  name: string;
  role: Role;
}
