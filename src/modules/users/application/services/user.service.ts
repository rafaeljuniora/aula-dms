import { CreateUserDto } from "@users/application/dto/create-user.dto";
import { UpdateUserDto } from "@users/application/dto/update-user.dto";
import { UserDto } from "@users/application/dto/user.dto";
import { User } from "@users/domain/models/user.entity";
import {
  USER_REPOSITORY,
  type UserRepository,
} from "@users/domain/repositories/user-repository.interface";
import type { PublishMessageDto } from "@messaging/application/dto/publish-message.dto";
import { MessagingService } from "@messaging/application/services/messaging.service";
import {
  AUTH_EXCHANGES,
  AUTH_ROUTING_KEYS,
} from "@messaging/application/constants/auth-events.constants";
import type {
  PaginatedResult,
  PaginationParams,
} from "@shared/infra/hateoas/hateoas.types";
import bcrypt from "bcryptjs";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

export interface UserPayload {
  id: string;
  email: string;
  permissions: string[];
}

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly messagingService: MessagingService,
  ) {}

  private async publishAuthEvent(
    exchangeName: string,
    routingKey: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const message: PublishMessageDto = {
      content: JSON.stringify(payload),
    };

    await this.messagingService.publish(message, exchangeName, routingKey);
  }

  async create(dto: CreateUserDto): Promise<void> {
    const existing = await this.userRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = User.restore({
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      teacherId: dto.teacherId,
      permissions: dto.permissions,
    });

    await this.userRepository.create(user!);

    const created = await this.userRepository.findByEmail(user!.email);
    if (created) {
      await this.publishAuthEvent(
        AUTH_EXCHANGES.created,
        AUTH_ROUTING_KEYS.created,
        {
          id: created.id,
          email: created.email,
          teacherId: created.teacherId,
          permissions: created.permissions,
        },
      );
    }
  }

  async edit(id: string, dto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const normalizedEmail = dto.email?.toLowerCase() ?? user.email;

    if (normalizedEmail !== user.email) {
      const existing = await this.userRepository.findByEmail(normalizedEmail);

      if (existing) {
        throw new ConflictException("Email already registered");
      }
    }

    let password = user.password;
    if (dto.password) {
      password = await bcrypt.hash(dto.password, 10);
    }

    const permissions = dto.permissions ?? user.permissions;
    const teacherId = dto.teacherId ?? user.teacherId;

    user
      .withEmail(normalizedEmail)
      .withPassword(password)
      .withTeacherId(teacherId)
      .withPermissions(permissions);

    await this.userRepository.update(user);

    await this.publishAuthEvent(
      AUTH_EXCHANGES.updated,
      AUTH_ROUTING_KEYS.updated,
      {
        id: user.id,
        email: user.email,
        teacherId: user.teacherId,
        permissions: user.permissions,
      },
    );
  }

  async remove(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    await this.userRepository.delete(id);

    if (existing) {
      await this.publishAuthEvent(
        AUTH_EXCHANGES.deleted,
        AUTH_ROUTING_KEYS.deleted,
        {
          id: existing.id,
          email: existing.email,
          teacherId: existing.teacherId,
          permissions: existing.permissions,
        },
      );
    }
  }

  async list(): Promise<UserDto[]> {
    const rows = await this.userRepository.findAll();
    return rows.map((row) => UserDto.from(row)!);
  }

  async listPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<UserDto>> {
    const rows = await this.list();
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;

    return {
      data: rows.slice(start, end),
      total: rows.length,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(id: string): Promise<UserDto | null> {
    const row = await this.userRepository.findById(id);
    return UserDto.from(row);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const row = await this.userRepository.findByEmail(email);
    return UserDto.from(row);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    return {
      id: user.id!,
      email: user.email,
      permissions: user.permissions,
    };
  }
}
