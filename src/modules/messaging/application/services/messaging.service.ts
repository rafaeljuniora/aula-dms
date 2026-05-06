import { Injectable, NotFoundException } from "@nestjs/common";
import { RabbitMQService } from "@messaging/infra/rabbitmq/rabbitmq.service";
import type { PublishMessageDto } from "../dto/publish-message.dto";
import { ConsumedMessageDto } from "../dto/consumed-message.dto";

@Injectable()
export class MessagingService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async createExchange(name: string, type: string): Promise<void> {
    const channel = this.rabbitMQService.getChannel();
    await channel.assertExchange(name, type, { durable: true });
  }

  async createQueue(
    queueName: string,
    exchangeName: string,
    routingKey: string,
  ): Promise<void> {
    const channel = this.rabbitMQService.getChannel();
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchangeName, routingKey);
  }

  async publish(
    dto: PublishMessageDto,
    exchangeName: string,
    routingKey: string,
  ): Promise<void> {
    const channel = this.rabbitMQService.getChannel();
    channel.publish(exchangeName, routingKey, Buffer.from(dto.content), {
      persistent: true,
    });
  }

  async consume(queueName: string): Promise<ConsumedMessageDto> {
    const channel = this.rabbitMQService.getChannel();
    const message = await channel.get(queueName, { noAck: false });

    if (!message) {
      throw new NotFoundException("No messages in queue");
    }

    channel.ack(message);
    return ConsumedMessageDto.from(queueName, message.content.toString());
  }
}
