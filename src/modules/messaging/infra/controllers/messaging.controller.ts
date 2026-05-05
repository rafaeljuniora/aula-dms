import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MessagingService } from "@messaging/application/services/messaging.service";
import { PublishMessageDto } from "@messaging/application/dto/publish-message.dto";
import { ConsumedMessageDto } from "@messaging/application/dto/consumed-message.dto";
import {
  AUTH_EXCHANGES,
  AUTH_QUEUES,
  AUTH_ROUTING_KEYS,
} from "@messaging/application/constants/auth-events.constants";
import { Public } from "@shared/infra/decorators/public.decorator";

const EXCHANGE_NAME = "school-control-example";
const EXCHANGE_TYPE = "direct";
const QUEUE_NAME = "school-control-example.queue";
const ROUTING_KEY = "school-control-example.key";

@ApiTags("messaging")
@Controller("messaging")
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post("exchange")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Criar/assegurar a exchange" })
  async createExchange(): Promise<void> {
    return this.messagingService.createExchange(EXCHANGE_NAME, EXCHANGE_TYPE);
  }

  @Post("queue")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Criar/assegurar a fila e vinculá-la à exchange" })
  async createQueue(): Promise<void> {
    return this.messagingService.createQueue(
      QUEUE_NAME,
      EXCHANGE_NAME,
      ROUTING_KEY,
    );
  }

  @Post("publish")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Publicar mensagem na exchange" })
  async publish(@Body() body: PublishMessageDto): Promise<void> {
    return this.messagingService.publish(body, EXCHANGE_NAME, ROUTING_KEY);
  }

  @Get("consume")
  @Public()
  @ApiOperation({ summary: "Ler próxima mensagem da fila" })
  async consume(): Promise<ConsumedMessageDto> {
    return this.messagingService.consume(QUEUE_NAME);
  }

  @Post("auth/exchanges")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Criar/assegurar exchanges do auth" })
  async createAuthExchanges(): Promise<void> {
    await Promise.all([
      this.messagingService.createExchange(AUTH_EXCHANGES.created, EXCHANGE_TYPE),
      this.messagingService.createExchange(AUTH_EXCHANGES.updated, EXCHANGE_TYPE),
      this.messagingService.createExchange(AUTH_EXCHANGES.deleted, EXCHANGE_TYPE),
    ]);
  }

  @Post("auth/queues")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Criar/assegurar filas do auth e vinculos" })
  async createAuthQueues(): Promise<void> {
    await Promise.all([
      this.messagingService.createQueue(
        AUTH_QUEUES.created,
        AUTH_EXCHANGES.created,
        AUTH_ROUTING_KEYS.created,
      ),
      this.messagingService.createQueue(
        AUTH_QUEUES.updated,
        AUTH_EXCHANGES.updated,
        AUTH_ROUTING_KEYS.updated,
      ),
      this.messagingService.createQueue(
        AUTH_QUEUES.deleted,
        AUTH_EXCHANGES.deleted,
        AUTH_ROUTING_KEYS.deleted,
      ),
    ]);
  }

  @Post("auth/publish/created")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Publicar user.created na exchange auth" })
  async publishAuthCreated(@Body() body: PublishMessageDto): Promise<void> {
    return this.messagingService.publish(
      body,
      AUTH_EXCHANGES.created,
      AUTH_ROUTING_KEYS.created,
    );
  }

  @Post("auth/publish/updated")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Publicar user.updated na exchange auth" })
  async publishAuthUpdated(@Body() body: PublishMessageDto): Promise<void> {
    return this.messagingService.publish(
      body,
      AUTH_EXCHANGES.updated,
      AUTH_ROUTING_KEYS.updated,
    );
  }

  @Post("auth/publish/deleted")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Publicar user.deleted na exchange auth" })
  async publishAuthDeleted(@Body() body: PublishMessageDto): Promise<void> {
    return this.messagingService.publish(
      body,
      AUTH_EXCHANGES.deleted,
      AUTH_ROUTING_KEYS.deleted,
    );
  }

  @Get("auth/consume/created")
  @Public()
  @ApiOperation({ summary: "Consumir da fila user.created" })
  async consumeAuthCreated(): Promise<ConsumedMessageDto> {
    return this.messagingService.consume(AUTH_QUEUES.created);
  }

  @Get("auth/consume/updated")
  @Public()
  @ApiOperation({ summary: "Consumir da fila user.updated" })
  async consumeAuthUpdated(): Promise<ConsumedMessageDto> {
    return this.messagingService.consume(AUTH_QUEUES.updated);
  }

  @Get("auth/consume/deleted")
  @Public()
  @ApiOperation({ summary: "Consumir da fila user.deleted" })
  async consumeAuthDeleted(): Promise<ConsumedMessageDto> {
    return this.messagingService.consume(AUTH_QUEUES.deleted);
  }
}
