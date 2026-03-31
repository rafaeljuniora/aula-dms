import { CreateUserDto } from "@users/application/dto/create-user.dto";
import { UpdateUserDto } from "@users/application/dto/update-user.dto";
import { UserDto } from "@users/application/dto/user.dto";
import { UserService } from "@users/application/services/user.service";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { HateoasItem, HateoasList } from "@shared/infra/hateoas";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @RequirePermissions(Permission.USERS_READ)
  @HateoasList<UserDto>({
    basePath: "/users",
    itemLinks: (item) => ({
      self: { href: `/users/${item.id}`, method: "GET" },
      update: { href: `/users/${item.id}`, method: "PUT" },
      delete: { href: `/users/${item.id}`, method: "DELETE" },
    }),
  })
  @ApiOperation({ summary: "Listar usuarios" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({ description: "Lista de usuarios" })
  @ApiUnauthorizedResponse({ description: "Nao autorizado" })
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.userService.listPaginated({ page, limit });
  }

  @Get(":id")
  @RequirePermissions(Permission.USERS_READ)
  @HateoasItem<UserDto>({
    basePath: "/users",
    itemLinks: (item) => ({
      self: { href: `/users/${item.id}`, method: "GET" },
      update: { href: `/users/${item.id}`, method: "PUT" },
      delete: { href: `/users/${item.id}`, method: "DELETE" },
      list: { href: "/users", method: "GET" },
      create: { href: "/users", method: "POST" },
    }),
  })
  @ApiOperation({ summary: "Buscar usuario por ID" })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: "Usuario nao encontrado" })
  async findById(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @RequirePermissions(Permission.USERS_WRITE)
  @ApiOperation({ summary: "Criar usuario" })
  @ApiCreatedResponse({ description: "Usuario criado" })
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Put(":id")
  @RequirePermissions(Permission.USERS_WRITE)
  @ApiOperation({ summary: "Atualizar usuario" })
  @ApiOkResponse({ description: "Usuario atualizado" })
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.userService.edit(id, body);
  }

  @Delete(":id")
  @RequirePermissions(Permission.USERS_DELETE)
  @ApiOperation({ summary: "Remover usuario" })
  @ApiOkResponse({ description: "Usuario removido" })
  async remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
