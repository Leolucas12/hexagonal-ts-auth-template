import { routesV1 } from '@config/app.routes';
import { Body, Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PaginatedQueryRequestDto } from '@src/libs/api/paginated-query.request.dto';
import { ResponseBase } from '@src/libs/api/response.base';
import { Paginated } from '@src/libs/ddd';
import { Result } from 'oxide.ts';
import { UserPaginatedResponseDto } from '../../dtos/user.paginated.response.dto';
import { FindUsersQuery } from './find-users.query-handler';
import { FindUsersRequestDto } from './find-users.request.dto';

@Controller(routesV1.version)
export class FindUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(routesV1.user.root)
  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPaginatedResponseDto,
  })
  async findUsers(
    @Body() request: FindUsersRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UserPaginatedResponseDto> {
    const query = new FindUsersQuery({
      ...request,
      limit: queryParams?.limit,
      page: queryParams?.page,
    });
    const result: Result<Paginated<User>, Error> = await this.queryBus.execute(
      query,
    );

    const paginated = result.unwrap();

    // Whitelisting returned properties
    return new UserPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map((user) => ({
        ...new ResponseBase(user),
        email: user.email,
        id: user.id,
        name: user.name,
      })),
    });
  }
}
