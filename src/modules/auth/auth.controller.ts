import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './dtos/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginRequestDTO } from './dtos/LoginRequestDTO';
import { routesV1 } from '@src/configs/app.routes';

@ApiTags('auth')
@Controller(routesV1.version)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post(routesV1.auth.login)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginRequestDTO })
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
}
