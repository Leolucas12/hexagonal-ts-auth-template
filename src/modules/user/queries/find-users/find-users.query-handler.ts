import { PaginatedParams, PaginatedQueryBase } from '@libs/ddd/query.base';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { Paginated } from '@src/libs/ddd';
import { PrismaService } from '@src/libs/prisma/prisma.service';
import { Ok, Result } from 'oxide.ts';

export class FindUsersQuery extends PaginatedQueryBase {
  readonly country?: string;

  readonly postalCode?: string;

  readonly street?: string;

  constructor(props: PaginatedParams<FindUsersQuery>) {
    super(props);
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }
}

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler implements IQueryHandler {
  constructor(private prisma: PrismaService) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */
  async execute(
    query: FindUsersQuery,
  ): Promise<Result<Paginated<User>, Error>> {
    const records = await this.prisma.user.findMany();
    const count = await this.prisma.user.count();

    return Ok(
      new Paginated({
        data: records,
        count: count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
