import { LoginDto } from "@auth/application/dto/login.dto";
import { LoginResponseDto } from "@auth/application/dto/login-response.dto";
import { AuthService } from "@auth/application/services/auth.service";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Public } from "@shared/infra/decorators/public.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Realizar login" })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: "Credenciais invalidas" })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
