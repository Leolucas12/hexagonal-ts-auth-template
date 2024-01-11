import { ApiProperty } from '@nestjs/swagger';
import { IdResponse } from './id.response.dto';

export interface BaseResponseProps {
  id: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Most of our response objects will have properties like
 * id, created_at and updated_at so we can move them to a
 * separate class and extend it to avoid duplication.
 */
export class ResponseBase extends IdResponse {
  constructor(props: BaseResponseProps) {
    super(props.id);
    this.created_at = new Date(props.created_at).toISOString();
    this.updated_at = new Date(props.updated_at).toISOString();
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly created_at: string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly updated_at: string;
}
